package test.exercise.morphologicalanalysis;

import java.io.IOException;

import org.apache.lucene.analysis.tokenattributes.CharTermAttribute;
import org.codelibs.neologd.ipadic.lucene.analysis.ja.JapaneseTokenizer;
import org.codelibs.neologd.ipadic.lucene.analysis.ja.JapaneseAnalyzer;
import org.codelibs.neologd.ipadic.lucene.analysis.ja.tokenattributes.BaseFormAttribute;
import org.codelibs.neologd.ipadic.lucene.analysis.ja.tokenattributes.PartOfSpeechAttribute;
import org.codelibs.neologd.ipadic.lucene.analysis.ja.tokenattributes.ReadingAttribute;
import org.junit.Test;
import static org.junit.Assert.*;

public class TestNeologd {
    
    /**
     * TODO:
     * CJKWidthFilterがjava.lang.NoClassDefFoundErrorになる。
     * 
     * 参考:
     * https://qiita.com/rockhopper/items/c4a7275e666f992ed510
     */
    @Test
    public void 住所を解析できる() {
        var adr1 = "福岡県宗像市上八";
        var expected = "フクオカケンムナカタシコウジョウ";
        var furigana = new StringBuilder();
        
        try (var analyzer = new JapaneseAnalyzer(null, JapaneseTokenizer.Mode.NORMAL, 
                JapaneseAnalyzer.getDefaultStopSet(), JapaneseAnalyzer.getDefaultStopTags());
             var tokenStream = analyzer.tokenStream("", adr1)) {
            //var baseAttr = tokenStream.addAttribute(BaseFormAttribute.class);
            //var charAttr = tokenStream.addAttribute(CharTermAttribute.class);
            //var posAttr = tokenStream.addAttribute(PartOfSpeechAttribute.class);
            var readAttr = tokenStream.addAttribute(ReadingAttribute.class);

            tokenStream.reset();
            
            while (tokenStream.incrementToken()) {
                //var tango = charAttr.toString();
                //var genkei = baseAttr.getBaseForm();
                var reading = readAttr.getReading();
                furigana.append(reading);
                //var hinshi = posAttr.getPartOfSpeech();
            }            
        } catch (IOException e) {
            fail(e.getMessage());
        }
        
        assertEquals(expected, furigana.toString());
    }
    
}
