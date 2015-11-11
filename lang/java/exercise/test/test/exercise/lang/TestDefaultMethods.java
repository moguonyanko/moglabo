package test.exercise.lang;

import java.time.LocalDateTime;
import java.time.Month;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.function.Supplier;
import java.util.function.Consumer;

import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

import exercise.lang.Excise;
import exercise.lang.Favorable;
import exercise.function.ShopItem;
import exercise.lang.Tax;
import exercise.lang.Taxable;
import exercise.lang.ZonedTimeMachine;
import exercise.function.IntCalculator;

/**
 * 参考：
 * 「Java Tutorial」(オラクル)
 * 「Java Language Specification Java SE 8 Edition」(オラクル)
 */
public class TestDefaultMethods {

	public TestDefaultMethods() {
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
	public void デフォルトの税金計算が出来る() {
		Tax tax = new Excise();

		Taxable item = new ShopItem("Apple", 100);

		int actual = tax.on(item);
		int expected = 108;

		assertThat(actual, is(expected));
	}

	@Test
	public void 優遇される金額が得られる() {
		Favorable f = new ShopItem("Apple", 100);

		int actual = f.getValue();
		int expected = 0;

		assertThat(actual, is(expected));
	}

	@Test
	public void デフォルトメソッドで時刻を変更し取得する() {
		LocalDateTime baseTime = LocalDateTime.of(2015, Month.OCTOBER, 20, 15, 30);
		ZoneId testZoneId = ZoneId.of("Europe/Paris");

		/**
		 * 匿名クラスはコンストラクタを定義できないし，
		 * 式の左辺に引数を渡すこともできない。
		 * new ZonedTimeMachine(2015)などとは書けない。
		 */
		ZonedTimeMachine tm = new ZonedTimeMachine() {

			private ZonedDateTime time;

			{
				time = ZonedDateTime.of(baseTime, testZoneId);
			}

			@Override
			public ZoneId getZonedId() {
				return testZoneId;
			}

			@Override
			public ZonedDateTime getTime() {
				return time;
			}

			@Override
			public void setTime(ZonedDateTime zdt) {
				time = zdt;
			}

		};

		/**
		 * LocalDateTimeやZonedDateTimeは不変。
		 */
		ZonedDateTime after3Days = baseTime.plusDays(3).atZone(testZoneId);

		tm.toFuture(after3Days);
		ZonedDateTime actual = tm.now();

		assertThat(actual, is(after3Days));
		assertThat(tm.getZonedId(), is(testZoneId));
	}

	private static class MyZonedTimeMachine implements ZonedTimeMachine {

		private ZonedDateTime time;
		private final ZoneId zoneId;

		public MyZonedTimeMachine(ZonedDateTime time, ZoneId testZoneId) {
			this.time = time;
			this.zoneId = testZoneId;
		}

		@Override
		public ZonedDateTime getTime() {
			return time;
		}

		@Override
		public void setTime(ZonedDateTime time) {
			this.time = time;
		}

		/**
		 * デフォルトメソッドによる実装が不十分でありオーバーライドが
		 * 必須の状況であっても，デフォルトメソッドがインターフェースで
		 * 定義されているとメソッドをオーバーライドしなくてもエラーにならない。
		 * 結果としてオーバーライドを忘れてしまう可能性がある。
		 */
		@Override
		public ZoneId getZonedId() {
			return zoneId;
		}
	}

	@Test
	public void デフォルトメソッドで並べ替える() {
		LocalDateTime localDateTime = LocalDateTime.of(2015, Month.OCTOBER, 20, 17, 13);

		ZoneId zone0 = ZoneId.of("Asia/Tokyo");
		ZonedDateTime sampleTime0 = localDateTime.atZone(zone0);
		ZoneId zone1 = ZoneId.of("Europe/Paris");
		ZonedDateTime sampleTime1 = localDateTime.atZone(zone1);

		MyZonedTimeMachine tokyoMachine = new MyZonedTimeMachine(sampleTime0, sampleTime0.getZone());
		MyZonedTimeMachine patisMachine = new MyZonedTimeMachine(sampleTime1, sampleTime1.getZone());

		List<MyZonedTimeMachine> source = Arrays.asList(patisMachine, tokyoMachine);

		/* 東京の方がパリよりも7時間進んでいるので並べ替えると順番が先になる。 */
		List<MyZonedTimeMachine> expected = Arrays.asList(tokyoMachine, patisMachine);

		List<MyZonedTimeMachine> actual = source.stream()
			.sorted()
			.collect(Collectors.toList());

		assertThat(actual, is(expected));
	}

	private static class Addition {

		/**
		 * こちらのcalcを削除するとSubAddtionがIntCalculatorのメソッドを
		 * 実装していないということでコンパイルエラーになる。
		 * AdditionはIntCalculatorと何の関係も無いがSubAddtionで行われるべき
		 * IntCalculatorの実装を肩代わりしている。
		 * しかしこちらに@Overrideを書くとコンパイルエラーになる。
		 */
		public Integer calc(Integer a, Integer b) {
			return a + b;
		}

		/**
		 * こちらのcalcはIntegerではなくintなのでIntCalculatorのメソッドを
		 * 実装したことにならない。
		 */
		public int calc(int a, int b) {
			return a + b;
		}
	}

	private static class SubAddtion extends Addition
		implements IntCalculator {

	}

	@Test
	public void インターフェースをスーパークラスで実装する() {
		Integer a = 7;
		Integer b = 3;

		Integer expected = 10;

		Addition addition = new SubAddtion();

		Integer actual = addition.calc(a, b);

		assertThat(actual, is(expected));
	}

	private static class Student {

		private final String name;
		private final int grade;

		public Student(String name, int grade) {
			this.name = name;
			this.grade = grade;
		}

		public String getName() {
			return name;
		}

		public int getGrade() {
			return grade;
		}

	}

	private static class School<C extends Collection<Student>> {

		private final C students;

		public School(C students) {
			this.students = students;
		}

		public <V extends Collection<String>, S extends Supplier<V>> V getGenericNames(S supplier) {
			return students.stream()
				.map(Student::getName)
				.collect(Collectors.toCollection(supplier));
		}

		/**
		 * このメソッドが実装されていないとSubSchoolはNameCheckerのメソッドを
		 * オーバーライドしていないとしてコンパイルエラーになる。
		 * しかし@Overrideを書くとコンパイルエラーである。
		 */
		//@Override
		public List<String> getNames() {
			return getGenericNames(ArrayList::new);
		}

	}

	private interface NameDumper {

		default List<String> getNames() {
			return Arrays.asList("Dump", "Domp", "Damp");
		}

	}

	private interface NameGetter {

		default List<String> getNames() {
			return Arrays.asList("Get", "Got", "Gat");
		}

	}

	private interface NameChecker {

		List<String> getNames();

	}

	private static class SubSchool extends School
		implements NameDumper, NameGetter, NameChecker {

		public SubSchool(List<Student> students) {
			super(students);
		}

	}

	@Test
	public void デフォルトメソッドよりも具象クラスのメソッドが優先される() {
		List<Student> students = Arrays.asList(
			new Student("foo", 3),
			new Student("bar", 1),
			new Student("baz", 2)
		);

		School school = new SubSchool(students);

		List<String> expected = Arrays.asList("foo", "bar", "baz");

		/**
		 * SubSchoolがimplementsしているインターフェースのメソッドは
		 * デフォルトメソッドとして実装されていても呼び出されない。
		 * SubSchoolのスーパークラスSchoolが実装している，シグネチャが全く同じ
		 * メソッドが呼び出される。
		 * NameCheckerのメソッドはSubSchoolで実装されていないが
		 * スーパークラスのSchoolが実装しているのでコンパイルエラーにならない。
		 */
		List<String> actual = school.getNames();

		assertThat(actual, is(expected));
	}

	private interface NameProvider {

		default List<String> getNames() {
			return Arrays.asList("I", "MY", "ME");
		}

	}

	private static class NameLoader implements NameDumper, NameGetter {

		private static List<String> getStaticNames() {
			/**
			 * staticメソッド内でsuperを指定してインターフェースのメソッドを
			 * 呼び出すことはできない。
			 */
			//return NameDumper.super.getNames();
			return Collections.emptyList();
		}

		private List<String> getInstanseNames() {
			/**
			 * インスタンスメソッド内であればsuperを介してスーパーインターフェースの
			 * メソッドを呼び出すことができる。
			 */
			List<String> dumpResult = new ArrayList<>(NameDumper.super.getNames());
			List<String> getResult = NameGetter.super.getNames();
			/**
			 * implementsしていないインターフェースのデフォルトメソッドを
			 * 呼びだそうとするとコンパイルエラーになる。
			 */
			//List<String> provideResult = NameProvider.super.getNames();

			/* デフォルトメソッドが定義されていなければ呼び出せない。 */
			//NameChecker.super.getNames();
			/**
			 * dumpResultがArrayList等といった可変長のコレクションでないと
			 * addAll呼び出し時にUnsupportedOperationExceptionが発生する。
			 */
			dumpResult.addAll(getResult);

			return dumpResult;
		}

		@Override
		public List<String> getNames() {
			return getInstanseNames();
		}

	}

	@Test
	public void 重複したデフォルトメソッドを選択して呼び出す() {
		NameLoader loader = new NameLoader();

		/**
		 * インターフェースを実装していないクラスからsuperを用いて
		 * インターフェースのメソッドを呼び出すことはできない。
		 */
		//NameDumper.super.getNames();
		List<String> expected = Arrays.asList("Dump", "Domp", "Damp", "Get", "Got", "Gat");
		List<String> actual = loader.getNames();

		assertThat(actual, is(expected));
	}
	
	/**
	 * 内部インターフェースはprivateにもstaticにもできる。
	 */
	private static interface IStudent {
		default String study(){
			return "I am study hard.";
		}
	}
	
	private static interface SubIStudent extends IStudent {
		/**
		 * IStudentのデフォルトメソッドは抽象メソッドで
		 * オーバーライドされた結果，暗黙では呼び出されなくなる。
		 */
		@Override
		String study();
	}
	
	private static class ParentStudent{
		/**
		 * SubIStudentのメソッドと同じシグネチャなので
		 * SubIStudentのメソッドとして実装されたものと解釈される。
		 * もちろん@Overrideを書いたらコンパイルエラーになる。
		 */
		public String study(){
			return "Study hard!";
		}
	}
	
	/**
	 * ParentStudentを継承していない場合，SubIStudentのメソッドを
	 * 実装していないとしてコンパイルエラーになる。
	 * スーパーインターフェースIStudentのデフォルトメソッドは
	 * SubIStudentでオーバーライドされた抽象メソッドで隠される。
	 * <pre>
	 * 	private static class Student3 implements SubIStudent
	 * </pre>
	 * デフォルトメソッドの解決を考える時は，そのクラス自身がextendsしているクラスと
	 * implementsしているインターフェースについてだけ考えるようにすればいい。
	 */
	private static class Student3 extends ParentStudent implements SubIStudent {
		/**
		 * 実装したインターフェースのスーパーインターフェースのデフォルトメソッドは
		 * 呼び出すことができない。コンパイルエラーになる。
		 */
		//@Override
		//public String study() {
		//	return IStudent.super.study();
		//}
	}
	
	private static class ParentStudent2 implements IStudent {

		@Override
		public String study() {
			return IStudent.super.study() + " Hurry up!!";
		}
		
	}
	
	private static class ParentStudent2_1 {
		public String study() {
			return "No, I am not study.";
		}
	}
	
	/**
	 * ParentStudent2にSubIStudentのメソッドと同じシグネチャのメソッドが
	 * 実装されていなければコンパイルエラーになる。
	 * ParentStudent2はIStudentを実装しているが，Student4のインスタンスを
	 * 介してメソッドが呼び出される時にIStudentのデフォルトメソッドが
	 * 暗黙で呼び出されることはない。
	 * 暗黙で呼び出されるデフォルトメソッドは自分がimplementsしている
	 * インターフェースのデフォルトメソッドだけであり，ここではSubIStudentが
	 * 該当するが，SubIStudentはデフォルトメソッドを持っていない。
	 * SubIStudentに何も定義されていなければIStudentのデフォルトメソッドが
	 * 呼び出される。
	 * 
	 * なおdefault修飾子はインターフェースでしか記述できない。
	 * 抽象クラスに記述するとコンパイルエラーになる。
	 */
	private static class Student4 extends ParentStudent2 implements SubIStudent {
	}
	
	/**
	 * implementsされたインターフェースのデフォルトメソッドより
	 * extendsされたクラスのメソッドが優先される。
	 */
	private static class Student5 extends ParentStudent2 implements IStudent {
	}
	
	private static class ParentStudent3 extends ParentStudent2_1 {
	}
	
	/**
	 * ParentStudent3のスーパークラスであるParentStudent2_1が
	 * IStudentのメソッドと同じシグネチャのメソッドを実装していなければ，
	 * IStudentのデフォルトメソッドが呼び出される。
	 * 継承しているクラスを辿って呼び出せるメソッドを探す仕組みは
	 * デフォルトメソッドが絡んでいても変わらない。
	 */
	private static class Student6 extends ParentStudent3 implements IStudent {
	}
	
	private static interface SubIStudent2 extends IStudent {		
	}
	
	/**
	 * 呼び出されようとしているメソッドが，実装または継承されている
	 * インターフェースを辿る途中でオーバーライドされていなければ，
	 * 最も祖先のインターフェースが持つデフォルトメソッドが呼び出される。
	 */
	private static class Student7 implements SubIStudent2 {
		
		void studyFail(){
			/**
			 * SubIStudent2のスーパーインターフェースのデフォルトメソッドは
			 * 呼び出せない。superキーワードで明示的に呼び出せるデフォルトメソッドは
			 * 自身がimplementsしているインターフェースのデフォルトメソッドのみである。
			 */
			//System.out.println(IStudent.super.study());
		}
	}
	
	@Test
	public void デフォルトメソッドを抽象メソッドでオーバーライドする(){
		List<Supplier<? extends IStudent>> students = Arrays.asList(
			Student3::new,
			Student4::new,
			Student5::new,
			Student6::new,
			Student7::new
		);
		
		/**
		 * Consumer<? extends IStudent>ではStream.forEachでコンパイルエラーになる。
		 */
		Consumer<IStudent> printStudying = 
			s -> System.out.println(s.getClass().getSimpleName() + ":" + s.study());
		
		students.stream()
			.map(Supplier::get)
			.forEach(printStudying);
	}
	
	private static interface Animal {
		default String getName(){
			return "any animal";
		}
	}
	
	private static interface Lion extends Animal {
		@Override
		default String getName(){
			//return "Lion";
			/**
			 * 無名クラスのインスタンスを介してgetNameが呼び出された時は
			 * 以下のコードは空文字を返す。
			 */
			return getClass().getSimpleName();
		}
	}
	
	private static interface Eagle extends Animal {
		
		/**
		 * EagleがgetNameをオーバーライドすると
		 * Chimeraから同じステップ数で辿れるgetNameが
		 * LionのものとEagleのものの2つ存在することになる。
		 * そのためコンパイルエラーが発生する。
		 * この場合，ChimeraあるいはChimeraを実装したクラスが
		 * getNameをオーバーライドする必要がある。
		 */
		//@Override
		//default public String getName(){
		//	return "EAGLE";
		//}
		
	}
	
	/**
	 * extendsの後に書いた順番はメソッド呼び出しの順番に何ら影響を与えない。
	 */
	private static interface Chimera extends Eagle, Lion {

		//@Override
		//default public String getName(){
		//	return Lion.super.getName() + " and " +  Eagle.super.getName();
		//}
	
	}
	
	/**
	 * 参考：
	 * 「Java Language Specification Java SE 8 Edition」(オラクル)
	 * 「9.4.1 Inheritance and Overriding」
	 */
	@Test
	public void デフォルトメソッド呼び出しの優先度を調べる(){
		String expected = "";
		
		String actual = new Chimera(){}.getName();
		
		assertThat(actual, is(expected));
	}

}
