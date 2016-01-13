package test.exercise.graphics;

import java.awt.image.BufferedImage;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import javax.imageio.ImageIO;

import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.is;

import exercise.graphics.Images;

public class TestImages {

	@BeforeClass
	public static void setUpClass() {
	}

	@AfterClass
	public static void tearDownClass() {
	}

	@Before
	public void setUp() {
	}

	@After
	public void tearDown() {
	}
	
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
	public void 画像の解像度を変更する() throws IOException {
		Path srcPath = Paths.get("./sample/square.jpg");
		BufferedImage srcImg = ImageIO.read(srcPath.toFile());

		int density = 2;
		BufferedImage dstImg = Images.changeDensity(srcImg, getFormatName(srcPath), density);
		Path dstPath = Paths.get("./sample/density_result.jpg");
		ImageIO.write(dstImg, getFormatName(srcPath), dstPath.toFile());
	}

	@Test
	public void 画像のサイズを変更する() throws IOException{
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
	}
	
}
