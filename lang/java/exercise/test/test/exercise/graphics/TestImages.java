package test.exercise.graphics;

import java.awt.*;
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
            //Path srcPath = Paths.get("./sample/star.png");
            Path srcPath = Paths.get("./sample/square.jpg");
            BufferedImage srcImg = ImageIO.read(srcPath.toFile());

            System.out.println("original width:" + srcImg.getWidth());
            System.out.println("original height:" + srcImg.getHeight());

            int width = 600;
            int height = 600;

            BufferedImage dstImg = Images.resize(srcImg, width, height);

            assertThat(dstImg.getWidth(), is(width));
            assertThat(dstImg.getHeight(), is(height));

            System.out.println("resized width:" + dstImg.getWidth());
            System.out.println("resized height:" + dstImg.getHeight());

            //Path dstPath = Paths.get("./sample/resize_result.png");
            Path dstPath = Paths.get("./sample/resize_result.jpg");
            String format = getFormatName(srcPath);
            ImageIO.write(dstImg, format, dstPath.toFile());

            Files.delete(dstPath);
        } catch(IOException e) {
            fail(e.getMessage());
        }
    }

	@Test
    public void canGetMultiResolutionImage() throws Exception {
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

}
