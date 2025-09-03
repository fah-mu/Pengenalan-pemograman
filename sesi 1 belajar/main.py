from libs import welcome_message, exit_program
from games import allove
from tools import warung

def menu():
    user_option = int(input(f'menu program:\n1. Games Tebak Allove\n2. Warung mini\n3. keluar program \nsilahkan pilih:'))
    
    if user_option == 1 :
        allove.start()
    elif user_option == 2:
        warung.start()
    elif user_option == 3:
        exit_program()
    else:
        print('hanya boleh pilih yang tersedia di menu!')


def main():
    welcome_message()
    menu()   

if __name__ == '__main__':
    main()