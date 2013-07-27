package exercise.io;

import static java.nio.file.StandardOpenOption.*;
import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.channels.SeekableByteChannel;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.logging.Level;
import java.util.logging.Logger;

public class RandomAccessPractice {

	public static void main(String[] args) {

		String text = "My name is usao!\n";
		byte[] data = text.getBytes();
		ByteBuffer newWriteBuffer = ByteBuffer.wrap(data);

		int allocateSize = 12;
		ByteBuffer copyBuffer = ByteBuffer.allocate(allocateSize);

		Path path = Paths.get("../../../sample/memo3.txt");

		try (SeekableByteChannel channel = Files.newByteChannel(path, READ, WRITE)) {

			/* Read just as much as allocated byte */
			int nread;
			do {
				nread = channel.read(copyBuffer);
			} while (nread != -1 && copyBuffer.hasRemaining());
			copyBuffer.flip();

			/* Write text content from the head of channel */
			channel.position(0);
			while (newWriteBuffer.hasRemaining()) {
				channel.write(newWriteBuffer);
			}
			newWriteBuffer.rewind();

			/* Copy allocated bytes at the tail of channel */
			long channelSize = channel.size();
			int lastPosition = (int)channelSize - 1;
			channel.position(0).position(12).position(3).truncate(channelSize / 2).position(lastPosition);

			while (copyBuffer.hasRemaining()) {
				channel.write(copyBuffer);
			}

			while (newWriteBuffer.hasRemaining()) {
				channel.write(newWriteBuffer);
			}

		} catch (IOException ex) {
			Logger.getLogger(RandomAccessPractice.class.getName()).log(Level.SEVERE, null, ex);
		}

	}
}
