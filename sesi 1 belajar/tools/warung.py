import main
def start():
    while True:
        print('ini warung')
        play_again =input('masukkan harga: ')
        
        if play_again == "y" :
            main.menu()
        
    
if __name__ == '__main__':
    start()