package test.exercise.concurrent;

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
import static org.hamcrest.CoreMatchers.*;

import exercise.concurrent.ForkGcd;
import exercise.concurrent.BlurImageCreator;

public class TestForkJoinPractice {

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

	@Test
	public void 並列処理で最大公約数を求める() {
		int a = Integer.MAX_VALUE;
		int b = 2;
		int expected = 1;
		int actual = ForkGcd.calc(a, b);

		assertThat(actual, is(expected));
	}

	@Test
	public void 並列処理で画像を加工する() throws IOException {
		Path srcPath = Paths.get("./sample/blur_sample.png");
		BufferedImage srcImg = ImageIO.read(srcPath.toFile());

		BufferedImage dstImg = BlurImageCreator.blur(srcImg);

		Path dstPath = Paths.get("./sample/blur_result.png");
		ImageIO.write(dstImg, "png", dstPath.toFile());
	}

}
