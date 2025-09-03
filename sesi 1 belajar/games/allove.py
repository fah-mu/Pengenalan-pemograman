from os import name
import random
import main

def start():
        while True:
                bentuk_goa = "[_]"
                goa_kosong = [bentuk_goa] * 4
                goa = goa_kosong.copy()
                allove_position = random.randint (1,4)

                goa[allove_position - 1] = "[0_0]"
                joined_array_goa_kosong = ''.join(goa_kosong)
                joined_array_goa = ''.join(goa)
                
                print(f'Coba perhatikan goa dibawah ini\n\n{joined_array_goa_kosong}\n')

                pilihan_user = int(input("menurut kamu dimana Allove berada? [1 / 2 / 3 / 4]: "))
                print()

                while pilihan_user!= 1 and pilihan_user!= 2 and pilihan_user!= 3 and pilihan_user!=4:
                        pilihan_user = int(input('Tolong masukkan angka yang sesuai! [1 / 2 / 3 / 4]:'))

                if pilihan_user == allove_position:
                        print(f"\npilihan kamu adalah\n\n {pilihan_user}")
                        print()
                        print(f"\n{joined_array_goa}\n\n  SELAMAT KAMU MENEMUKAN ALLOVE!")
                else:
                        print(f"pilihan kamu adalah {pilihan_user}")
                        print(f"{joined_array_goa}  Yahh salah, allove bukan disana. Tapi Allove berada di goa {allove_position}")
                        print()
                
                play_again = input(f"\n\nmau udahan atau lanjut lagi? [lanjut(y) / udahan (n)]")
                if play_again == "n":
                        main.menu()
                
                

if __name__ == '__main__':
        start()