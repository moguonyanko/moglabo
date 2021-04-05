package exercise.graphics;

import java.awt.*;
import java.awt.geom.Line2D;
import java.awt.image.BaseMultiResolutionImage;
import java.awt.image.BufferedImage;
import java.awt.image.MultiResolutionImage;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Path;
import java.util.Iterator;
import java.util.List;

import static java.util.stream.Collectors.*;

import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageReader;
import javax.imageio.ImageWriteParam;

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
                String name;
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
     * TODO:
     * implement
     */
    public static BufferedImage changeDensity(BufferedImage src, String format,
                                              int density) {
        return src;
    }

    public static MultiResolutionImage loadMultiResolutionImage(
        List<Path> imagePaths) {

        var multiImage = new BaseMultiResolutionImage(imagePaths.stream()
                .map(path -> {
                    Image image;
                    try {
                        image = ImageIO.read(path.toFile());
                    } catch (IOException e) {
                        throw new IllegalStateException(e);
                    }
                    return image;
                }).toArray(Image[]::new));

        return multiImage;
    }

    public static void dumpHints(BufferedImage image) {
        var sg = (Graphics2D) image.getGraphics();
        var srcHints = sg.getRenderingHints();
        srcHints.forEach((key, value) -> System.out.println(key + ":" + value));
    }

    /**
     * ただ別のBufferedImageに書き出しているだけでなぜサイズが小さくなるのかが
     * 分かっていない。やっていることはresizeとほぼ同じ。
     * 参考:
     * http://www.java2s.com/Tutorials/Java/Graphics_How_to/Image/Reduce_the_size_of_an_image_file.htm
     */
    public static BufferedImage reduceImage(BufferedImage src) {
        int w = src.getWidth(), h = src.getHeight();
        var newImage = new BufferedImage(w, h, src.getType());
        var g = newImage.createGraphics();
        g.drawImage(src, 0, 0, w, h, null);
        g.dispose();

//		g.setComposite(AlphaComposite.Src);
//		g.setRenderingHint(RenderingHints.KEY_INTERPOLATION,
//			RenderingHints.VALUE_INTERPOLATION_BILINEAR);
//		g.setRenderingHint(RenderingHints.KEY_RENDERING,
//			RenderingHints.VALUE_RENDER_QUALITY);
//		g.setRenderingHint(RenderingHints.KEY_ANTIALIASING,
//			RenderingHints.VALUE_ANTIALIAS_ON);

        return newImage;
    }

    /**
     * 参考:
     * https://memorynotfound.com/compress-images-java-example/
     */
    public static void outputWithCompression(BufferedImage src,
        String format, float quality, OutputStream out) throws IOException {
        var writer = ImageIO.getImageWritersByFormatName(format).next();
		var imageStream = ImageIO.createImageOutputStream(out);
		writer.setOutput(imageStream);

		var param = writer.getDefaultWriteParam();
		if (param.canWriteCompressed()) {
			param.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
			param.setCompressionQuality(quality);
		}

		// ImageWriterParamを渡せるメソッドを呼ぶためにIIOImageを生成している。
		writer.write(null, new IIOImage(src, null, null), param);
		writer.dispose();
    }

}
