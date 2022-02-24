package exercise.io;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

public class CharsetPractice {

    private static void readSrcFile(Path src, Charset srcCharset) throws IOException {
        System.out.println("src file size:" + Files.size(src));
        var text = "こんにちは";
        // 文字セットを指定しなくても例外は発生せずUTF-8で書き出される。
        Files.writeString(src, text, srcCharset);
//        var srcBytes = text.getBytes(srcCharset);
//        Files.write(src, srcBytes);
        // 文字セットを指定せずwindows-31jのファイルを読み込むと例外
//        System.out.println(Files.readString(src));
        // 文字セットの指定がなければJDK18以降環境によらずUTF-8で読み込み
        try (var br = new BufferedReader(new FileReader(src.toFile(), srcCharset))) {
            for (var line = br.readLine(); line != null; line = br.readLine()) {
                System.out.println("src text:" + line);
            }
        }
    }

    private static void writeDstFile(Path src, Path dst, Charset srcCharset)
            throws IOException {
        // Files.readAllLinesでもreadStringと同様の例外が起きる。この振る舞いはJDK8でも19でも同じ。
//        var lines = Files.readAllLines(src, srcCharset);
//        try (var bw = Files.newBufferedWriter(dst)) { // UTF-8で書き出される。
//            for (var line : lines) {
//                bw.write(line);
//            }
//        }

        // JDK18以降は文字セットを指定しなければUTF-8で読み込まれる。
        // 文字セットを指定しなくてもJDK17以前であれば動作環境の規定の文字セットで読み込まれる。
        // Windowsであればwindows-31jで読み込まれるので文字化けしない。その仕様に依存した
        // プログラムはJDK18に移行した時に文字化けが発生する。
        try (var br = new BufferedReader(new FileReader(src.toFile(), srcCharset))) {
            try (var bw = Files.newBufferedWriter(dst)) { // UTF-8で書き出される。
                for (var line = br.readLine(); line != null; line = br.readLine()) {
                    bw.write(line);
                }
            }
        }
        System.out.println("dst file size:" + Files.size(dst));
        // UTF-8で書き出されているので例外は発生しない。
        System.out.println("dst text:" + Files.readString(dst));
    }

    public static void main(String[] args) throws IOException {
        System.out.println("Charset.defaultCharset():" + Charset.defaultCharset());
        var src = Paths.get("sample/charset/sample_src.txt");
        var srcCharset = Charset.forName("windows-31j");
        System.out.println("src charset:" + srcCharset.name());
        readSrcFile(src, srcCharset);
        var dst = Paths.get("sample/charset/sample_dst.txt");
        writeDstFile(src, dst, srcCharset);
    }

}
