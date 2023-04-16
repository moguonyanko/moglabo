package test.exercise.lang;

import exercise.lang.FakeSingleton;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.Serializable;
import java.nio.file.Paths;
import static org.hamcrest.CoreMatchers.is;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import static org.junit.Assert.*;

public class TestSerialize {
	
	public TestSerialize() {
	}
	
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
	public void シリアライズ可能なクラスはシングルトンではない(){
		FakeSingleton org = FakeSingleton.INSTANCE;
		FakeSingleton faker;
		
		try{
			ByteArrayOutputStream baos = new ByteArrayOutputStream();
			new ObjectOutputStream(baos).writeObject(org);
			ByteArrayInputStream bais = new ByteArrayInputStream(baos.toByteArray());
			faker = (FakeSingleton)new ObjectInputStream(bais).readObject();
			
			assertFalse(org == faker);
			assertThat(org.getName(), is(faker.getName()));
		}catch(IOException | ClassNotFoundException ex){
			fail(ex.getMessage());
		}
	}
	
    /**
     * 参考:
     * https://blogs.oracle.com/javamagazine/post/java-quiz-deserialize-enums-records
     * 
     * recordのBatterがデシリアライズされる際にBatterTypeも初期化される。
     * この時全ての列挙子に対してコンストラクタが呼び出される。
     */
    private enum BatterType {
        RIGHT("R"), LEFT("L"), SWITCH;

        private BatterType() {
            System.out.println("Batter type code none");
        }
        
        private BatterType(String type) {
            System.out.println("Batter type code " + type);
        }
    }
    
    private record Batter(String name, int age, BatterType bt) implements Serializable {
        Batter() {
            this("no name", -1, BatterType.SWITCH);
            System.out.println("Batter name " + name);
        }
        Batter {
            System.out.println("Batter name " + name);
        }
    }
    
    private void writeBatter(File file) throws IOException {
        var batter = new Batter("ICHIRO", 28, BatterType.LEFT);
        try (var fos = new FileOutputStream(file);
             var oos = new ObjectOutputStream(fos)) {
            oos.writeObject(batter);
        } 
    }
    
    /**
     * 参考:
     * https://www.baeldung.com/java-serialization
     */
    @Test
    public void recordをシリアライズできる() throws IOException, ClassNotFoundException {
        var file = Paths.get("./sample/batter.obj").toFile();
        //writeBatter(file);
        
        try (var fis = new FileInputStream(file);
             var ois = new ObjectInputStream(fis)) {
            System.out.println("----- Batter object output start -----");
            var bt = (Batter) ois.readObject(); 
            System.out.println(bt);
            System.out.println("----- Batter object output end -----");
        } 
    }
    
}
