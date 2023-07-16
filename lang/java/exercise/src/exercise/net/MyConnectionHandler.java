package exercise.net;

import java.net.Socket;

/**
 * 参考
 * 「Javaネットワークプログラミングの真髄」
 */
public abstract class MyConnectionHandler implements Runnable {
    
    private final Socket socket;

    public MyConnectionHandler(Socket socket) {
        this.socket = socket;
    }
    
    abstract void handleConversation();

    @Override
    public void run() {
        handleConversation();
    }

    public Socket getSocket() {
        return socket;
    }
    
}
