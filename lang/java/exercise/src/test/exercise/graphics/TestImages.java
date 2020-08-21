package test.exercise.graphics;

import java.awt.*;
import java.awt.geom.CubicCurve2D;
import java.awt.geom.QuadCurve2D;
import java.awt.image.BufferedImage;
import java.awt.image.MultiResolutionImage;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import javax.imageio.ImageIO;

import org.junit.Test;
import org.junit.Ignore;
import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.is;

import exercise.graphics.Images;

/**
 * 参考:
 * https://www.sitepoint.com/ultimate-guide-to-java-9/
 */
public class TestImages {

	private String getFormatName(Path srcPath){
		return srcPath.getFileName().toString().split("\\.")[1];
	}

	@Test
	public void 画像のフォーマット名を得る() throws IOException {
		Path srcPath = Paths.get("./sample/star.png");
		
		String expected = "png";
		String actual = Images.getFormatName(srcPath);
		
		assertThat(actual.toLowerCase(), is(expected));
	}

	@Test
    @Ignore("Images.changeDensityが未実装につきスキップします。")
	public void 画像の解像度を変更する() throws IOException {
		Path srcPath = Paths.get("./sample/square.jpg");
		BufferedImage srcImg = ImageIO.read(srcPath.toFile());

		int density = 2;
		BufferedImage dstImg = Images.changeDensity(srcImg, getFormatName(srcPath), density);
		Path dstPath = Paths.get("./sample/density_result.jpg");
		ImageIO.write(dstImg, getFormatName(srcPath), dstPath.toFile());
	}

	@Test
	public void 画像のサイズを変更する() {
        try {
            var srcPath = Paths.get("./sample/stars.png");
            var srcImg = ImageIO.read(srcPath.toFile());

            System.out.println("original width:" + srcImg.getWidth());
            System.out.println("original height:" + srcImg.getHeight());

            var width = srcImg.getWidth() / 2;
            var height = srcImg.getHeight() / 2;

            var dstImg = Images.resize(srcImg, width, height);

            assertThat(dstImg.getWidth(), is(width));
            assertThat(dstImg.getHeight(), is(height));

            System.out.println("resized width:" + dstImg.getWidth());
            System.out.println("resized height:" + dstImg.getHeight());

            var dstPath = Paths.get("./sample/resize_result.png");
            var format = getFormatName(srcPath);
            ImageIO.write(dstImg, format, dstPath.toFile());

            //Files.delete(dstPath);
        } catch(IOException e) {
            fail(e.getMessage());
        }
    }

	@Test
    public void canGetMultiResolutionImage() {
	    List<Path> paths = List.of(
            Paths.get("./sample/star2_1.png"),
            Paths.get("./sample/star2_2.png"),
            Paths.get("./sample/star2_3.png")
        );
        MultiResolutionImage img = Images.loadMultiResolutionImage(paths);
        // TODO: 何を指定しても最初の画像が返されてしまう。
        Image variant = img.getResolutionVariant(800, 800);
        int expected = 360;
        int actual = variant.getWidth(null);
        System.out.println(variant);
        assertThat(actual, is(expected));
    }

    @Test
    public void canReduceImageSize() throws IOException {
	    var srcPath = Paths.get("./sample/stars.png");
	    var srcSize = Files.size(srcPath);
	    var src = ImageIO.read(srcPath.toFile());

	    //Images.dumpHints(src);
        //System.out.println("----- REDUCING -----");

	    var dst = Images.reduceImage(src);
        //Images.dumpHints(dst);
        var dstPath = Paths.get("./sample/stars_reduced.png");
        var dstFile = dstPath.toFile();
        ImageIO.write(dst, "png", dstFile);
	    var dstSize = Files.size(dstPath);
	    //Files.delete(dstPath);

        System.out.println("SRC:" + srcSize + " byte");
        System.out.println("DST:" + dstSize + " byte");

        var srcHints = ((Graphics2D)src.getGraphics()).getRenderingHints();
        var dstHints = ((Graphics2D)dst.getGraphics()).getRenderingHints();
        assertEquals(srcHints, dstHints);
	    assertTrue(srcSize > dstSize);
    }

    @Test
    public void canCompressImage() throws IOException {
        var dstPath = Paths.get("./sample/stars_compressed.png");
        try (var out = Files.newOutputStream(dstPath)) {
            var srcPath = Paths.get("./sample/stars.png");
            var src = ImageIO.read(srcPath.toFile());
            // 1に近づけると元の画像よりもサイズが大きくなる。
            // いくら0に近づけても一定のサイズより小さくならない。
            var quality = 0.01f;
            Images.outputWithCompression(src, "PNG", quality, out);

            var srcSize = Files.size(srcPath);
            var dstSize = Files.size(dstPath);

            System.out.println("SRC:" + srcSize + " byte");
            System.out.println("DST:" + dstSize + " byte");

            assertTrue(srcSize > dstSize);
        }
    }

    /**
     * TODO: 作業中
     */
    @Test
    public void カーブを描画できる() throws IOException {
        var dstImg = new BufferedImage(400, 400, BufferedImage.TYPE_INT_ARGB);
        var g = (Graphics2D)dstImg.getGraphics();

        var c1 = new QuadCurve2D.Double();
        c1.setCurve(0, 0, 100, 100, 400, 400);
        g.draw(c1);

        var c2 = new CubicCurve2D.Double();
        c2.setCurve(0, 0, 100, 100, 200, 200, 400, 400);
        g.draw(c2);

        var dstPath = Paths.get("./sample/curve.png");
        ImageIO.write(dstImg, "png", dstPath.toFile());
    }
}
