package exercise.net;

import java.net.Socket;
import java.net.SocketException;
import java.util.logging.Level;
import java.util.logging.Logger;

public class KeepAliveCheck {

	public static void main(String[] args) {

		Socket socket = new Socket();
		/* socket default keep-alive is false because RFC1122. */
		try {
			socket.setKeepAlive(true);
			System.out.println(socket.getInetAddress());
			System.out.println(socket.getKeepAlive());
		} catch (SocketException ex) {
			Logger.getLogger(KeepAliveCheck.class.getName()).log(Level.SEVERE, null, ex);
		}

	}
}
