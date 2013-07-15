package exercise.concurrent;

import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.RejectedExecutionException;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Executor practice class.
 * 
 * Reference:
 *「Java並行処理プログラミング」（ブライアン・ゲーツ，ダグ・リー他）			
 * 
 * @author hisako
 */
public class ExecutorPractice {

	public static void main(String[] args) {
		
		LifeCycleWebServer server = new LifeCycleWebServer();
		try {
			server.start();
		} catch (IOException ex) {
			Logger.getLogger(ExecutorPractice.class.getName()).log(Level.SEVERE, null, ex);
		}
	}
}

class LifeCycleWebServer{
	private static final int THREADBOUND = 100;
	
	private static final ExecutorService executorService = 
		Executors.newFixedThreadPool(THREADBOUND);
	
	
	void start() throws IOException{
		ServerSocket serverSocket = new ServerSocket(80);
		
		while(!executorService.isShutdown()){
			try{
				final Socket socket = serverSocket.accept();
				
				executorService.execute(new Runnable() {

					@Override
					public void run() {
						handleRequest(socket);
					}
				});
				
			}catch(RejectedExecutionException ex){
				if(!executorService.isShutdown()){
					System.err.println("Task submission rejected. : " + ex.getMessage());
				}
			}
		}
		
	}
	
	void stop(){
		executorService.shutdown();
	}
	
	private void handleRequest(Socket socket){
		/* @todo Request handling implement. */
		
		System.out.println(Thread.currentThread().getName() + ", handle request.");
	}
}