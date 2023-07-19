package moglabo.practicejava.net;

import java.io.IOException;
import java.net.InetAddress;
import java.net.ServerSocket;
import java.net.Socket;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class SocketTest {

    @Test
    void ループバックアドレスを判別できる() throws Exception {
        // localhostはループバックアドレスとは限らない。
        var adr = InetAddress.getLoopbackAddress();
        assertTrue(adr.isLoopbackAddress());
    }

    @Test
    void ローカルアドレスを再利用できる() throws IOException {
        var port = 38888;
        try (var server1 = new ServerSocket(port); 
             // portが衝突するとBindExceptionが発生するので1足す。
             var server2 = new ServerSocket(port + 1)) {
            // 戻り値がtrueかどうかはOSに依存する。macOSではtrueになる。
            // ServerSocketコンストラクタに渡したポート番号が他のServerSocketで使われて
            // いるとserver.getReuseAddress()はfalseを返すことがある。
            var reusable1 = server1.getReuseAddress();
            assertTrue(reusable1);
            var reusable2 = server2.getReuseAddress();
            assertTrue(reusable2);
        }
    }

    @Test
    void 受信バッファサイズを確認できる() throws IOException {
        try (var server = new ServerSocket(38888)) {
            var size = server.getReceiveBufferSize();
            System.out.println(size);
            assertNotNull(size);
        }
    }
    
    @Test
    void リモートホストの情報を取得できる() throws IOException {
        var host = "myhost";
        var port = 80;
        try (var socket = new Socket(host, port)) {
            var addr = socket.getRemoteSocketAddress();
            System.out.println(addr);
            assertNotNull(addr);
            assertEquals(socket.getPort(), port);
        }
    }

}
