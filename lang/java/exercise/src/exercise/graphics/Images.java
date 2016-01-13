package exercise.graphics;

import java.awt.AlphaComposite;
import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.nio.file.Path;
import java.util.Iterator;
import java.util.List;
import static java.util.stream.Collectors.*;

import javax.imageio.ImageIO;
import javax.imageio.ImageReader;

import exercise.stream.StreamUtil;

public class Images {

	private static final double INCH_2_CM = 2.54;
	private static final int DEFAULT_DPI = 96;

	/**
	 * 参考:
	 * http://www.mkyong.com/java/how-to-resize-an-image-in-java/
	 */
	public static BufferedImage resize(BufferedImage originalImage, int width, int height) {
		int type = originalImage.getType() == 0 ? 
			BufferedImage.TYPE_INT_ARGB : 
			originalImage.getType();
		
		BufferedImage resizedImage = new BufferedImage(width, height, type);
		Graphics2D g = resizedImage.createGraphics();
		g.drawImage(originalImage, 0, 0, width, height, null);
		g.dispose();

		g.setComposite(AlphaComposite.Src);
		g.setRenderingHint(RenderingHints.KEY_INTERPOLATION,
			RenderingHints.VALUE_INTERPOLATION_BILINEAR);
		g.setRenderingHint(RenderingHints.KEY_RENDERING,
			RenderingHints.VALUE_RENDER_QUALITY);
		g.setRenderingHint(RenderingHints.KEY_ANTIALIASING,
			RenderingHints.VALUE_ANTIALIAS_ON);

		return resizedImage;
	}

	/**
	 * 参考:
	 * http://stackoverflow.com/questions/11447035/java-get-image-extension-type-using-bufferedimage-from-url
	 */
	public static String getFormatName(Path src) throws IOException {
		Iterator<ImageReader> iterator
			= ImageIO.getImageReaders(ImageIO.createImageInputStream(src.toFile()));
		List<String> formats = StreamUtil.stream(iterator, false)
			.map(reader -> {
				String name = "";
				try {
					name = reader.getFormatName();
				} catch (IOException ex) {
					throw new IllegalStateException(ex.getMessage());
				}
				return name;
			})
			.collect(toList());

		return !formats.isEmpty() ? formats.get(0) : "";
	}

	/**
	 * @todo
	 * implement
	 */
	public static BufferedImage changeDensity(BufferedImage src, String format, int density)
		throws IOException {
		return null;
	}

}
