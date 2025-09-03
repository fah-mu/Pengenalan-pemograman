program workoutapp;
uses crt;

var 
level, angkarandom: integer;
easy, medium, hard: array[1..5] of string;
lanjut: boolean; 

begin
    clrscr;

    easy[1] := 'push-up 5x' ;
    easy[2] := 'sit-up 10x' ;
    easy[3]:= 'plank  20 detik' ;
    easy[4]:= 'squat 8x' ;
    easy[5]:= 'jumping jack 15x' ;

    medium[1] := 'push-up 15x' ;
    medium[2] := 'sit-up 20x' ;
    medium[3]:= 'plank  40 detik' ;
    medium[4]:= 'squat 15x' ;
    medium[5]:= 'jumping jack 25x' ;

    hard[1]:= 'push-up 20x' ;
    hard[2]:= 'burpees 15x' ;
    hard[3]:= 'plank  1 menit' ;
    hard[4]:= 'mountain Climbers 30x' ;
    hard[5]:= 'jumping jack 25x' ;

    lanjut := true;

    while lanjut do
    begin
    clrscr;

    writeln('*** Workout Rumahan ***');
    writeln('Pilih level workout kamu: ');
    writeln('1. Easy');
    writeln('2. Medium');
    writeln('3. Hard');
    writeln('4. Keluar ');
    write(' Masukkan pilihan level {1-4}: ');
    readln(level);

    
    angkarandom := random(5) + 1;

        case level of
        1: begin
                writeln;
                writeln('Level Workout kamu: Easy');
                writeln('Latihan untuk kamu: ', easy[angkarandom]);
            end;
        
         2: begin
            writeln;
            writeln('Level Workout kamu: Medium');
            writeln('Latihan untuk kamu: ', medium[angkarandom]);
           end;
        
         3: begin
            writeln;
            writeln('Level Workout kamu: Hard');
            writeln('Latihan untuk kamu: ', hard[angkarandom]);
            end;
        
         4: begin
            writeln;
            writeln('Keluar dari program, sampai jumpa, sehat selalu');
            lanjut := false;
            end;
        
         else
        writeln('Pilihan tidak valid! silahkan coba lagi.');
        end;

    if lanjut then 
        begin
    writeln;
    writeln('Tekan enter untuk kembali ke menu.');
    readln;
        end;
      
  end;      
 end.
