package exercise.concurrent;

import java.awt.image.BufferedImage;
import java.util.concurrent.ForkJoinPool;
import java.util.concurrent.RecursiveAction;

/**
 * 参考：
 * 「Java Tutorial」(オラクル)
 * http://docs.oracle.com/javase/tutorial/essential/concurrency/forkjoin.html
 * http://docs.oracle.com/javase/tutorial/essential/concurrency/examples/ForkBlur.java
 */
public class BlurImageCreator extends RecursiveAction {

	private final int[] srcRgb;
	private final int[] dstRgb;

	private final int start;
	private final int length;

	private final int blurWidth = 15;

	private static final int THRESHOLD = 10000;

	public BlurImageCreator(int[] srcRgb, int[] dstRgb, int start, int length) {
		this.srcRgb = srcRgb;
		this.dstRgb = dstRgb;
		this.start = start;
		this.length = length;
	}

	private void processBlur() {
		int sidePixels = (blurWidth - 1) / 2;

		for (int idx = start; idx < start + length; idx++) {
			/**
			 * @todo
			 * 元のサンプルに従いdoubleではなくfloatにした。
			 * doubleではアトミックではなくなる。ローカル変数でも問題になるのか？
			 */
			float r = 0;
			float g = 0;
			float b = 0;

			for (int i = -sidePixels; i <= sidePixels; i++) {
				int pixelIdx = Math.min(Math.max(i + idx, 0), srcRgb.length - 1);
				int srcPixel = srcRgb[pixelIdx];

				r += ((srcPixel & 0x00ff0000) >> 16) / blurWidth;
				g += ((srcPixel & 0x0000ff00) >> 8) / blurWidth;
				b += (srcPixel & 0x000000ff) / blurWidth;
			}

			int dstPixel = (0xff000000)
				| (int) r << 16
				| (int) g << 8
				| (int) b;

			dstRgb[idx] = dstPixel;
		}
	}

	@Override
	protected void compute() {
		if (length < THRESHOLD) {
			processBlur();
		} else {
			int splitLength = length / 2;
			BlurImageCreator task1
				= new BlurImageCreator(srcRgb, dstRgb, start, splitLength);
			BlurImageCreator task2
				= new BlurImageCreator(srcRgb, dstRgb, start + splitLength,
					length - splitLength);
			invokeAll(task1, task2);
		}
	}

	public static BufferedImage blur(BufferedImage srcImg) {
		int width = srcImg.getWidth();
		int height = srcImg.getHeight();

		int[] srcRgb = srcImg.getRGB(0, 0, width, height, null, 0, width);
		int[] dstRgb = new int[srcRgb.length];

		BlurImageCreator creator = new BlurImageCreator(srcRgb, dstRgb, 0, srcRgb.length);

		int processors = Runtime.getRuntime().availableProcessors();
		ForkJoinPool pool = new ForkJoinPool(processors);

		pool.invoke(creator);

		BufferedImage dstImg = new BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB);
		dstImg.setRGB(0, 0, width, height, dstRgb, 0, width);
		
		pool.shutdown();

		return dstImg;
	}

}
