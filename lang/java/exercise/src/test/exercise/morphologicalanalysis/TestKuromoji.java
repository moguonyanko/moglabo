package test.exercise.morphologicalanalysis;

import java.util.stream.Collectors;

import com.atilika.kuromoji.ipadic.Token;
import com.atilika.kuromoji.ipadic.Tokenizer;
import org.junit.Test;
import static org.junit.Assert.*;

/**
 * 参考:
 * https://www.atilika.com/ja/kuromoji/
 * https://github.com/atilika/kuromoji
 */
public class TestKuromoji {
    
    private static String getFurigana(String address) {
        var tokenizer = new Tokenizer() ;
        var tokens = tokenizer.tokenize(address);
        var furigana = tokens.stream()
                .map(Token::getReading)
                .collect(Collectors.joining());
        
        return furigana;
    }
    
    @Test
    public void 住所文字列のふりがなを得られる() {
//        tokens.stream().forEach(token -> {
//            System.out.println(token.getSurface() + "\t" + token.getAllFeatures());
//        });
        
        var furigana = getFurigana("福岡県宗像市上八");
        var expected = "フクオカケンムナカタシコウジョウ";
        assertEquals(expected, furigana);
        
        // 「ヅメキ」が「ツメキ」になってしまう。
//        furigana = getFurigana("青森県上北郡六戸町犬落瀬通目木");
//        expected = "アオモリケンカミキタグンロクノヘマチイヌオトセヅメキ";
//        assertEquals(expected, furigana);

        // 「フシノキ」が「ゴバイキ」になってしまう。
//        furigana = getFurigana("徳島県那賀郡那賀町掛盤五倍木");
//        expected = "トクシマケンナカグンナカチョウカケバンフシノキ";
//        assertEquals(expected, furigana);
    }
    
}
