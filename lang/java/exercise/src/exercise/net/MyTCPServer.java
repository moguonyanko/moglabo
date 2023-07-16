package exercise.net;

import java.io.IOException;
import java.net.ServerSocket;

/**
 * 参考
 * 「Javaネットワークプログラミングの真髄」
 */
public class MyTCPServer implements Runnable {
    
    private final ServerSocket serverSocket;

    public MyTCPServer(int port) throws IOException {
        this.serverSocket = new ServerSocket(port);
    }

    @Override
    public void run() {
        while(true) {
            try {
                var socket = serverSocket.accept();
                new Thread(new MyEchoConnectionHandler(socket)).start();
            } catch (IOException ex) {
                ex.printStackTrace();
            }
        }
    }
    
}
