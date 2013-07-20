package exercise.io;

import java.io.IOException;
import java.nio.file.FileSystems;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardWatchEventKinds;
import java.nio.file.WatchEvent;
import java.nio.file.WatchKey;
import java.nio.file.WatchService;
import java.util.logging.Level;
import java.util.logging.Logger;

public class WatchablePractice {

	public static void main(String[] args) {
		Path target = Paths.get("/var/log");
		
		try (WatchService watchService = FileSystems.getDefault().newWatchService()) {

			target.register(watchService,
				StandardWatchEventKinds.ENTRY_CREATE,
				StandardWatchEventKinds.ENTRY_DELETE,
				StandardWatchEventKinds.ENTRY_MODIFY);

			System.out.println("Start watch " + target.toAbsolutePath());

			while (true) {
				WatchKey key = watchService.take();

				for (WatchEvent event : key.pollEvents()) {
					System.out.println(event.kind());
				}

				key.reset();
			}

		} catch (IOException | InterruptedException ex) {
			Logger.getLogger(WatchablePractice.class.getName()).log(Level.SEVERE, null, ex);
		}
	}
}
