Program latihan;
Var
n : integer;

function f(x:integer):integer;
var
i, hasil: integer;
begin
hasil := 1;
for i := 1 to x do
    hasil := hasil  * i;
f := hasil
end;

begin
write ('masukkan angka : ');
readln(n);
writeln('faktorial dari ', n ,' adalah ', f(n));
readln;
end.