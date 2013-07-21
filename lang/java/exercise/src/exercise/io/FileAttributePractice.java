package exercise.io;

import java.io.IOException;
import java.nio.file.FileStore;
import java.nio.file.FileSystems;
import java.nio.file.Files;
import java.nio.file.LinkOption;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.attribute.BasicFileAttributes;
import java.nio.file.attribute.FileAttribute;
import java.nio.file.attribute.PosixFileAttributes;
import java.nio.file.attribute.PosixFilePermission;
import java.nio.file.attribute.PosixFilePermissions;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;

public class FileAttributePractice {

	public static void main(String args[]) {
		try {
			Path path = Paths.get("../../../sample/memo2.txt");
			FileAttrManager attr = new FileAttrManager(path,
				PosixFileAttributes.class);
			attr.display();
			//attr.createLink(Paths.get("../../../sample/memo2"));

			attr.displayStore();
			
			FileAttrManager.displayAllStore();
		} catch (IOException ex) {
			Logger.getLogger(FileAttributePractice.class.getName()).log(Level.SEVERE, null, ex);
		}

	}
}

class FileAttrManager {

	private final Path orgPath;
	private final BasicFileAttributes attr;

	public FileAttrManager(Path path, Class cls) throws IOException {
		orgPath = path;
		this.attr = Files.readAttributes(path, cls, LinkOption.NOFOLLOW_LINKS);
	}

	void display() {
		System.out.println("creationTime: " + attr.creationTime());
		System.out.println("lastAccessTime: " + attr.lastAccessTime());
		System.out.println("lastModifiedTime: " + attr.lastModifiedTime());
		System.out.println("isDirectory: " + attr.isDirectory());
		System.out.println("isOther: " + attr.isOther());
		System.out.println("isRegularFile: " + attr.isRegularFile());
		System.out.println("isSymbolicLink: " + attr.isSymbolicLink());
		System.out.println("size: " + attr.size());

		if (attr instanceof PosixFileAttributes) {
			PosixFileAttributes _attr = (PosixFileAttributes) attr;
			System.out.format("%s %s %s%n",
				_attr.owner().getName(),
				_attr.group().getName(),
				PosixFilePermissions.toString(_attr.permissions()));
		}
	}

	void createLink(Path newPath) throws IOException {
		if (attr instanceof PosixFileAttributes) {
			PosixFileAttributes _attr = (PosixFileAttributes) attr;
			FileAttribute<Set<PosixFilePermission>> newAttr =
				PosixFilePermissions.asFileAttribute(_attr.permissions());
			Files.createSymbolicLink(orgPath, newPath, newAttr);
		}
	}

	void displayStore() throws IOException {
		FileStore store = Files.getFileStore(orgPath);

		long total = store.getTotalSpace() / 1024;
		long used = (store.getTotalSpace() - store.getUnallocatedSpace()) / 1024;
		long avail = store.getUsableSpace() / 1024;

		System.out.println("total:" + total + " used:" + used + " avail:" + avail);
	}

	static void displayAllStore() throws IOException {
		for (FileStore store : FileSystems.getDefault().getFileStores()) {
			long total = store.getTotalSpace() / 1024;
			long used = (store.getTotalSpace() - store.getUnallocatedSpace()) / 1024;
			long avail = store.getUsableSpace() / 1024;
			System.out.format("%-20s %12d %12d %12d%n", store, total, used, avail);
		}
	}
}
