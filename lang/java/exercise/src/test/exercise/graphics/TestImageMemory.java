package test.exercise.graphics;

import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import javax.imageio.ImageIO;

import org.junit.Test;
import org.junit.After;
import org.junit.Before;
import org.junit.Ignore;

/**
 * 画像の入出力や描画時におけるメモリ使用量の振る舞いを調査するためのクラス
 *
 */
public class TestImageMemory {
    
    @Before
    public void setup() {
        var javaVersion = System.getProperty("java.version");
        System.out.println("Java version:" + javaVersion);        
    }

    private static BufferedImage getResizedImage(BufferedImage src, int width, int height) {
        var img = src.getScaledInstance(width, height, Image.SCALE_SMOOTH);
        // TYPE_INT_ARGBを指定するとJPEG画像は出力できなくなる。
        var dst = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
        var g = dst.createGraphics();
        g.drawImage(img, 0, 0, null);
        return dst;
    }

    private static void dumpMemory() {
        var runtime = Runtime.getRuntime();
        var free = runtime.freeMemory() / 1024;
        var max = runtime.maxMemory() / 1024;
        var total = runtime.totalMemory() / 1024;
        System.out.println(free + " free, " + total + " total, " + max + " max.");
        System.out.println("total - free(KB):" + (total - free));
    }

    @Test
    public void リサイズでメモリリークしない() throws IOException {
        var count = 10000;
        var reductionRatio = 10;

        System.out.println("画像の数:" + count);
        dumpMemory();
        
        ImageIO.setUseCache(false);

        for (int i = 0; i < count; i++) {
            var srcPath = Paths.get("./sample/rabbit.jpeg");
            var orgImg = ImageIO.read(srcPath.toFile());
            var orgWidth = orgImg.getWidth();
            var orgHeight = orgImg.getHeight();
            var newImg = getResizedImage(orgImg, 
                    orgWidth / reductionRatio, orgHeight / reductionRatio);
            var dstPath = Paths.get("./sample/memorytest/resized_rabbit.jpeg");
            //var dstPath = Paths.get("./sample/memorytest/resized_rabbit" + i + ".jpeg");
            ImageIO.write(newImg, "jpg", dstPath.toFile());
            if (i % 100 == 0) {
                dumpMemory();
            }
        }

        dumpMemory();
    }

    @After
    public void clean() throws IOException {
        var dstPath = Paths.get("./sample/memorytest/");
        Files.walk(dstPath).forEach(p -> {
            try {
                if (!Files.isDirectory(p)) {
                    Files.deleteIfExists(p);
                }
            } catch (IOException e) {
                throw new IllegalStateException(e);
            }
        });
        System.out.println("ファイル削除完了");
    }
}
