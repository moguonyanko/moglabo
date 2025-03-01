package test.exercise.graphics;

import java.awt.*;
import java.awt.font.TextLayout;
import java.awt.geom.*;
import java.awt.image.*;
import java.io.IOException;
import java.nio.Buffer;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Hashtable;
import java.util.List;
import java.util.concurrent.Callable;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executors;
import java.util.stream.Collectors;
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

    private String getFormatName(Path srcPath) {
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
        } catch (IOException e) {
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

        var srcHints = ((Graphics2D) src.getGraphics()).getRenderingHints();
        var dstHints = ((Graphics2D) dst.getGraphics()).getRenderingHints();
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

    @Test
    public void カーブを描画できる() throws IOException {
        var w = 200;
        var h = 200;
        var dstImg = new BufferedImage(w, h, BufferedImage.TYPE_INT_ARGB);
        var g = (Graphics2D) dstImg.getGraphics();

        var stroke = new BasicStroke(2.0f);
        g.setStroke(stroke);
        g.setRenderingHint(RenderingHints.KEY_ANTIALIASING,
            RenderingHints.VALUE_ANTIALIAS_ON);

        var c1 = new QuadCurve2D.Double();
        c1.setCurve(0, 0, 20, 150, w, h);
        g.setColor(Color.RED);
        g.draw(c1);

        var c2 = new CubicCurve2D.Double();
        c2.setCurve(0, 0, 100, 10, 0, 200, w, h);
        g.setColor(Color.BLUE);
        g.draw(c2);

        var dstPath = Paths.get("./sample/curve1.png");
        ImageIO.write(dstImg, "png", dstPath.toFile());
    }

    @Test
    public void 線種を変更できる() throws IOException {
        var w = 200;
        var h = 200;
        var dstImg = new BufferedImage(w, h, BufferedImage.TYPE_INT_ARGB);
        var g2 = (Graphics2D) dstImg.getGraphics();

        var stroke = new BasicStroke(1.0f,
            BasicStroke.CAP_BUTT,
            BasicStroke.JOIN_MITER,
            10.0f, new float[]{10.0f}, 0.0f);
        g2.setStroke(stroke);
        g2.setColor(Color.BLACK);
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING,
            RenderingHints.VALUE_ANTIALIAS_ON);

        var path = new GeneralPath();
        path.moveTo(0, 0);
        path.lineTo(100, 100);
        path.lineTo(150, 50);
        path.lineTo(200, 200);
        g2.draw(path);

        var dstPath = Paths.get("./sample/stroke1.png");
        ImageIO.write(dstImg, "png", dstPath.toFile());
    }

    @Test
    public void テクスチャーで塗りつぶせる() throws IOException {
        var textureImage = new BufferedImage(6, 6, BufferedImage.TYPE_INT_ARGB);
        var tg2 = (Graphics2D) textureImage.getGraphics();

        tg2.setColor(Color.RED);
        tg2.fillRect(0, 0, 2, 2);

        var anchor = new Rectangle2D.Double(0, 0, textureImage.getWidth(),
            textureImage.getHeight());
        var paint = new TexturePaint(textureImage, anchor);

        var image = new BufferedImage(200, 200, BufferedImage.TYPE_INT_ARGB);
        var g2 = (Graphics2D) image.getGraphics();
        g2.setColor(Color.PINK);
        g2.drawRect(50, 50, 100, 100);
        g2.setPaint(paint);
        g2.fillRect(50, 50, 100, 100);

        var path = Paths.get("./sample/texture1.png");
        ImageIO.write(image, "png", path.toFile());
    }

    @Test
    public void テキストの背景を描画できる() throws IOException {
        var img = new BufferedImage(200, 200, BufferedImage.TYPE_INT_ARGB);

        var font = new Font("Monospaced", Font.PLAIN, 14);
        var g2 = (Graphics2D) img.getGraphics();
        g2.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING,
            RenderingHints.VALUE_TEXT_ANTIALIAS_LCD_HRGB);

        var metrics = g2.getFontMetrics(font);
        var sample = "こんにちは！";
        var h = metrics.getHeight();
        var w = metrics.stringWidth(sample);
        var l = metrics.getLeading();
        var d = metrics.getDescent();
        var rect = new Rectangle(0, 0, w, h - l);
        g2.setColor(Color.GREEN);
        g2.fill(rect);
        g2.setColor(Color.BLACK);
        g2.drawString(sample, 0, h - d);

        var path = Paths.get("./sample/text1.png");
        ImageIO.write(img, "png", path.toFile());
    }

    private Graphics2D toG2(Graphics g) {
        if (g instanceof Graphics2D g2) {
            return g2;
        } else {
            throw new IllegalArgumentException("Required Graphics2D object");
        }
    }

    @Test
    public void Areaで弧を描ける() throws IOException {
        var img = new BufferedImage(200, 200, BufferedImage.TYPE_INT_ARGB);

        var arc = new Area(new Ellipse2D.Double(0, 0, 50, 50));
        var clip = new Area(new Rectangle2D.Double(0, -25, 50, 50));
        // クリップされた部分が描画領域として残る。
        arc.intersect(clip);

        var g2 = toG2(img.getGraphics());
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING,
            RenderingHints.VALUE_ANTIALIAS_ON);
        g2.setColor(Color.BLACK);
        g2.draw(arc);
        g2.setColor(Color.BLUE);
        g2.fill(arc);

        var path = Paths.get("./sample/arc1.png");
        ImageIO.write(img, "png", path.toFile());
    }

    @Test
    public void VolatileImageを生成できる() throws IOException {
        var srcImg = new BufferedImage(200, 200, BufferedImage.TYPE_INT_ARGB);

        var g2 = toG2(srcImg.getGraphics());
        var gc = g2.getDeviceConfiguration();
        var vi = gc.createCompatibleVolatileImage(srcImg.getWidth(),
            srcImg.getHeight());

        var vg2 = toG2(vi.getGraphics());
        var path = new GeneralPath();
        path.moveTo(0, 0);
        path.lineTo(50, 100);
        path.lineTo(100, 50);
        path.lineTo(200, 200);
        vg2.draw(path);

        var dstImg = vi.getSnapshot();

        var dstPath = Paths.get("./sample/stars_volatile.png");
        ImageIO.write(dstImg, "png", dstPath.toFile());

        vg2.dispose();
        // disposeされてもcontentsLostされていない。
        System.out.println("VolatileImage is contentLost?: " + vi.contentsLost());

        var valid = vi.validate(vg2.getDeviceConfiguration());
        assertEquals(VolatileImage.IMAGE_RESTORED, valid);
    }

    private static List<Shape> getSampleShapes() {
        var line1 = new Line2D.Double(0, 0, 500, 500);
        var line2 = new Line2D.Double(100, 100, 500, 100);
        var line3 = new Line2D.Double(300, 100, 400, 400);

        var rect1 = new Rectangle2D.Double(20, 20, 300, 300);
        var rect2 = new Rectangle2D.Double(100, 100, 100, 100);
        var rect3 = new Rectangle2D.Double(100, 50, 200, 200);

        return List.of(
            line1, line2, line3, rect1, rect2, rect3
        );
    }

    private static List<Shape> getSampleShapes(int size, int width, int height) {
        var list = new ArrayList<Shape>();
        for (int i = 0; i < size; i++) {
            var rect = new Rectangle2D.Double(
                width - Math.random() * width,
                height - Math.random() * height,
                Math.random() * width,
                Math.random() * height);
            list.add(rect);
        }
        return list;
    }

    @Test
    public void 非同期処理で図形描画できる() throws IOException {
        var width = 500;
        var height = 500;
        var shapes = getSampleShapes(10000, width, height);
        var img = new BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB);

        var g2 = img.createGraphics();
        g2.setColor(Color.WHITE);
        g2.fillRect(0, 0, img.getWidth(), img.getHeight());
        g2.setColor(Color.BLACK);

        //shapes.stream().forEach(s -> g2.draw(s));
        // 非同期にしても速度の向上は見られない。
        shapes.stream()
            .map(shape -> CompletableFuture.runAsync(() -> g2.draw(shape)))
            .map(CompletableFuture::join)
            .forEach(v -> {
            });

        var dstPath = Paths.get("./sample/sampleshapes.png");
        ImageIO.write(img, "png", dstPath.toFile());
    }

    private record DrawTask(Graphics2D g2,
                            Shape shape) implements Callable<Shape> {
        @Override
        public Shape call() {
            g2.draw(shape);
            return shape;
        }
    }

    @Test
    public void 並列処理で図形を描画できる() throws IOException, InterruptedException {
        var width = 500;
        var height = 500;
        var shapes = getSampleShapes(10000, width, height);
        var img = new BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB);
        var g2 = img.createGraphics();
        g2.setColor(Color.WHITE);
        g2.fillRect(0, 0, img.getWidth(), img.getHeight());
        g2.setColor(Color.BLACK);

        var tasks = shapes.stream()
            .map(s -> new DrawTask(g2, s))
            .collect(Collectors.toList());

        //var executor = Executors.newSingleThreadExecutor();
        // 並列処理で描画しても速度の向上は見られない。
        var executor = Executors.newFixedThreadPool(10);
        executor.invokeAll(tasks);

        var dstPath = Paths.get("./sample/sampleshapes_thread.png");
        ImageIO.write(img, "png", dstPath.toFile());
    }

    @Test
    public void TextLayoutを使ってテキスト描画できる() throws IOException {
        var width = 500;
        var height = 500;
        var img = new BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB);

        var string = "Hello, world";
        var g2 = img.createGraphics();
        g2.setColor(Color.BLACK);
        g2.fillRect(0, 0, width, height);
        g2.setColor(Color.WHITE);

        var font = new Font("Serif", Font.BOLD, 18);
        var frc = g2.getFontRenderContext();
        var layout = new TextLayout(string, font, frc);
        layout.draw(g2, width >> 1, height >> 1);

        var bounds = layout.getBounds();
        var margin = 10;
        bounds.setRect(new Rectangle2D.Double(margin, margin,
            width - margin * 2, height - margin * 2));
        g2.draw(bounds);

        var dstPath = Paths.get("./sample/sampletextlayout.png");
        ImageIO.write(img, "png", dstPath.toFile());
    }

    private Stroke getSampleStroke() {
        var stroke = new BasicStroke(0.5f,
            BasicStroke.CAP_ROUND,
            BasicStroke.JOIN_BEVEL,
            5.0f, new float[]{5.0f}, 0.0f);
        return stroke;
    }

    private void drawSampleStroke(BufferedImage img, Color color) {
        var width = img.getWidth();
        var height = img.getHeight();

        var g2 = img.createGraphics();
        g2.setColor(Color.BLACK);
        g2.fillRect(0, 0, width, height);
        g2.setColor(color);

        g2.setStroke(getSampleStroke());

        for (int i = 0; i < 100; i++) {
            var w = width - 100;
            var h = height - 100;
            g2.draw(new RoundRectangle2D.Double(i, i, w, h, 10, 10));
        }
    }

    @Test
    public void GraphicsEnvironmentからGraphicsConfigurationを得る() throws IOException {
        var width = 500;
        var height = 500;
        // デフォルトと等しいimageTypeはTYPE_INT_RGB
        var img = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);

        drawSampleStroke(img, Color.WHITE);
        var dstPath = Paths.get("./sample/optimizedimage.png");
        ImageIO.write(img, "png", dstPath.toFile());

        var img2 = Images.getOptimizedBufferedImage(img);
        drawSampleStroke(img2, Color.RED);

        var dstPath2 = Paths.get("./sample/optimizedimage2.png");
        ImageIO.write(img2, "png", dstPath2.toFile());
    }

    private Hashtable<?, ?> getProperties(BufferedImage image) {
        var hash = new Hashtable<>();
        var names = image.getPropertyNames();
        if (names == null) {
            return hash;
        }
        for (var name : names) {
            var property = image.getProperty(name);
            hash.put(name, property);
        }
        return hash;
    }

    @Test
    public void VolatileImageの内容をBufferedImageにコピーできる() throws IOException {
        var width = 500;
        var height = 500;
        var src = new BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB);

        var gc = src.createGraphics().getDeviceConfiguration();
        var vi = gc.createCompatibleVolatileImage(width, height);

        var margin = 10;
        var g = vi.createGraphics();
        g.setColor(Color.PINK);
        var rect = new Rectangle2D.Double(margin, margin,
            width - margin * 2, height - margin * 2);
        g.fill(rect);

        vi.flush();
        // snapshotをそのまま書き出せばいいのだが、ここでは他のBufferedImageに
        // VolatileImageの内容をコピーする操作をテストしたいので以下のように記述している。
        var snapshot = vi.getSnapshot();
        var dst = new BufferedImage(snapshot.getColorModel(), snapshot.getRaster(),
            snapshot.isAlphaPremultiplied(), getProperties(snapshot));

        var dstPath = Paths.get("./sample/copy_rect_from_volatileimage.png");
        ImageIO.write(dst, "png", dstPath.toFile());
    }

    @Test
    public void 最適化されたBufferedImageを作成できる() throws IOException {
        var env = GraphicsEnvironment.getLocalGraphicsEnvironment();
        var devs = env.getScreenDevices();
        for (var dev : devs) {
            var gcs = dev.getConfigurations();
            var gc = gcs[0];
            System.out.println(gc);
            var rect = gc.getBounds();
            var bImg = gc.createCompatibleImage(rect.width, rect.height);
            var g = bImg.createGraphics();
            g.setColor(Color.GREEN);
            g.fillRect(10, 10, rect.width - 20, rect.height - 20);
            var dstPath = Paths.get("./sample/compatiblebufferedimage.png");
            ImageIO.write(bImg, "png", dstPath.toFile());
        }
    }

    @Test
    public void 画像の一部を切り取る() throws IOException {
        var path = Paths.get("./sample/star.png");
        var srcImg = ImageIO.read(path.toFile());

        var width = 100;
        var height = 100;
        //var dstImg = srcImg.getSubimage(0, 0, width, height);
        var dstImg = new BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB);
        // clipping
        dstImg.setData(srcImg.getData());

        var dstPath = Paths.get("./sample/clipped_star.png");
        ImageIO.write(dstImg, "png", dstPath.toFile());
    }

    /**
     * 参考:
     * https://stackoverflow.com/questions/9417356/bufferedimage-resize
     */
    @Test
    public void BufferedImageをリサイズできる() throws IOException {
        var width = 50;
        var height = 50;

        var path = Paths.get("./sample/star.png");
        var orgImg = ImageIO.read(path.toFile());
        Image img = orgImg.getScaledInstance(width, height, Image.SCALE_SMOOTH);
        var newImg = new BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB);
        var g = newImg.createGraphics();
        g.drawImage(img, 0, 0, null);

        var dst = Paths.get("./sample/resized_star.png");
        ImageIO.write(newImg, "png", dst.toFile());
    }

    @Test
    public void BufferedImageをクリッピングできる() throws IOException {
        var path = Paths.get("./sample/star.png");
        var srcImg = ImageIO.read(path.toFile());

        var dstImg = new BufferedImage(srcImg.getWidth(), srcImg.getHeight(),
            BufferedImage.TYPE_INT_ARGB);
        var g = dstImg.createGraphics();
        g.setClip(new Rectangle(100, 100, 50, 50));
        g.drawImage(srcImg, 0, 0, null);

        var dst = Paths.get("./sample/clipped_star2.png");
        ImageIO.write(dstImg, "png", dst.toFile());
    }
}
