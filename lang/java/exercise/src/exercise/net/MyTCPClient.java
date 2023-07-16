package exercise.net;

import java.io.IOException;
import java.net.Socket;

/**
 * 参考
 * 「Javaネットワークプログラミングの真髄」
 */
public class MyTCPClient {
    
    public void execute(String host, int port) {
        try (var socket = new Socket(host, port)) {
            var out = socket.getOutputStream();
            
            // 省略
            
            out.flush();
            var in = socket.getInputStream();
            
            // 省略
        } catch (IOException ex) {
            ex.printStackTrace();
        }
    }
    
}
