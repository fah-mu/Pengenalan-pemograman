<?php
session_start();
require_once 'db.php';

$action = $_GET['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];

// Pastikan kategori dasar selalu ada agar foreign key tidak error
mysqli_query($conn, "INSERT IGNORE INTO categories (id, nama_kategori, deskripsi) VALUES 
    (1, 'U-Ride', 'Layanan antar-jemput'),
    (2, 'U-Food', 'Jasa titip makanan'),
    (3, 'U-Help', 'Jasa bantuan umum'),
    (4, 'U-Design', 'Desain grafis'),
    (5, 'Les Privat', 'Bimbingan belajar')");

if ($action === 'gigs' && $method === 'GET') {
    $res = mysqli_query($conn, "SELECT g.id, g.judul AS title, c.nama_kategori AS category, g.tarif AS price, u.nama_lengkap AS provider, u.npm, g.rating, g.total_pesanan AS orders, g.deskripsi AS `desc`, u.no_whatsapp AS whatsapp FROM gigs g JOIN users u ON g.user_id = u.id JOIN categories c ON g.category_id = c.id WHERE g.status = 'aktif' ORDER BY g.id DESC");
    $data = [];
    while ($row = mysqli_fetch_assoc($res)) {
        $row['id'] = (int)$row['id'];
        $row['price'] = (int)$row['price'];
        $row['rating'] = (float)$row['rating'];
        $data[] = $row;
    }
    echo json_encode(["status" => "success", "data" => $data]);
    exit;
}

$input = json_decode(file_get_contents("php://input"), true);

if ($action === 'auth' && $method === 'POST') {
    $name = mysqli_real_escape_string($conn, trim($input['name'] ?? ''));
    $email = mysqli_real_escape_string($conn, trim($input['email'] ?? ''));
    $wa = mysqli_real_escape_string($conn, trim($input['whatsapp'] ?? '6281234567890'));

    if (!str_contains($email, '@unsika.ac.id')) {
        http_response_code(403);
        echo json_encode(["status" => "error", "message" => "Wajib menggunakan email @unsika.ac.id"]);
        exit;
    }

    $npm = explode('@', $email)[0];
    $q = mysqli_query($conn, "SELECT * FROM users WHERE email = '$email' LIMIT 1");
    if (mysqli_num_rows($q) > 0) {
        $user = mysqli_fetch_assoc($q);
    } else {
        $pass = password_hash('unsika2026', PASSWORD_DEFAULT);
        mysqli_query($conn, "INSERT INTO users (npm, nama_lengkap, email, password_hash, no_whatsapp, is_verified) VALUES ('$npm', '$name', '$email', '$pass', '$wa', 1)");
        $user = ["id" => mysqli_insert_id($conn), "npm" => $npm, "nama_lengkap" => $name, "email" => $email];
    }
    echo json_encode(["status" => "success", "user" => $user]);
    exit;
}

if ($action === 'gigs' && $method === 'POST') {
    $uid = (int)($input['user_id'] ?? 1);
    
    // Pastikan user dengan ID tersebut ada di database untuk mencegah error Foreign Key
    $check_user = mysqli_query($conn, "SELECT id FROM users WHERE id = $uid LIMIT 1");
    if (mysqli_num_rows($check_user) === 0) {
        mysqli_query($conn, "INSERT INTO users (id, npm, nama_lengkap, email, password_hash, no_whatsapp, is_verified) VALUES (1, '2510631170034', 'Fahmi Mubaroq', '2510631170034@student.unsika.ac.id', 'hash', '6281234567895', 1)");
        $uid = 1;
    }

    $cat = mysqli_real_escape_string($conn, $input['category'] ?? '');
    $title = mysqli_real_escape_string($conn, $input['title'] ?? '');
    $price = (int)($input['price'] ?? 0);
    $desc = mysqli_real_escape_string($conn, $input['desc'] ?? '');
    $wa = mysqli_real_escape_string($conn, $input['whatsapp'] ?? '');

    $c_res = mysqli_query($conn, "SELECT id FROM categories WHERE nama_kategori = '$cat' LIMIT 1");
    $c_row = mysqli_fetch_assoc($c_res);
    $cid = $c_row ? (int)$c_row['id'] : 3;

    mysqli_query($conn, "UPDATE users SET no_whatsapp = '$wa' WHERE id = $uid");
    $insert = mysqli_query($conn, "INSERT INTO gigs (user_id, category_id, judul, deskripsi, tarif) VALUES ($uid, $cid, '$title', '$desc', $price)");
    
    if ($insert) {
        echo json_encode(["status" => "success"]);
    } else {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => mysqli_error($conn)]);
    }
    exit;
}

if ($action === 'orders' && $method === 'POST') {
    $gid = (int)$input['gig_id'];
    $cid = (int)($input['client_id'] ?? 1);
    $notes = mysqli_real_escape_string($conn, $input['notes']);
    $pay = mysqli_real_escape_string($conn, $input['payment']);
    $price = (int)$input['base_price'];
    $total = $price + 1000;
    $code = 'UG-' . date('Ymd') . '-' . rand(1000, 9999);

    mysqli_query($conn, "INSERT INTO orders (kode_pesanan, gig_id, client_id, catatan, metode_pembayaran, biaya_jasa, biaya_admin, total_bayar) VALUES ('$code', $gid, $cid, '$notes', '$pay', $price, 1000, $total)");
    mysqli_query($conn, "UPDATE gigs SET total_pesanan = total_pesanan + 1 WHERE id = $gid");
    echo json_encode(["status" => "success", "kode" => $code]);
    exit;
}
?>