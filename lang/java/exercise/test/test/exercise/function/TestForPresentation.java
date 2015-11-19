package test.exercise.function;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.TreeMap;
import java.util.function.Function;
import java.util.function.ToIntFunction;
import static java.util.stream.Collectors.*;

import org.junit.Test;

public class TestForPresentation {
	
	private static final int BORDER_LINE = 40;
	
	private enum SchoolClass{
		A, B, C
	}
	
	private enum Subject {
		MATH,
		ENGLISH,
		CHEMISTRY
	}
	
	private static class Student {
		private final String name;
		private final int score;
		private final SchoolClass cls;

		public Student(String name, int score, SchoolClass cls) {
			this.name = name;
			this.score = score;
			this.cls = cls;
		}

		public SchoolClass getSchoolClass() {
			return cls;
		}

		public String getName() {
			return name;
		}

		public int getScore() {
			return score;
		}

		@Override
		public boolean equals(Object obj) {
			if(obj instanceof Student){
				Student other = (Student)obj;
				
				/**
				 * 同姓同名は考慮しない。
				 */
				return name.equals(other.name) 
					&& score == other.score
					&& cls == other.cls;
			}else{
				return false;
			}
		}

		@Override
		public int hashCode() {
			return Objects.hash(name, score, cls);
		}
	}
	
	private static List<Student> getSampleStudents(){
		List<Student> students = Arrays.asList(
			new Student("foo", 85, SchoolClass.A),
			new Student("bar", 30, SchoolClass.A),
			new Student("baz", 40, SchoolClass.C),
			new Student("hoge", 90, SchoolClass.C),
			new Student("taro", 95, SchoolClass.B),
			new Student("jiro", 100, SchoolClass.A),
			new Student("saburo", 10, SchoolClass.B),
			new Student("shiro", 15, SchoolClass.C),
			new Student("goro", 20, SchoolClass.B),
			new Student("pochi", 60, SchoolClass.A)
		);
		
		return students;
	}
	
	/**
	 * テストに合格した学生の名前を点数の高い順に並べて所属するクラスごとに分類する。
	 * またクラスはクラス名の自然順で並べる。
	 * 
	 * Java8の機能やAPI(ラムダ，メソッド参照，Collectors)を使わずに行うバージョンと
	 * 使って行うバージョンを用意する。
	 */
	
	@Test
	public void Java8の機能無しで分類を行う(){
		List<Student> students = getSampleStudents();
		
		/**
		 * テストに合格した生徒をリストに集める。
		 */
		List<Student> passedStudents = new ArrayList<>();
		for(Student student : students){
			if(student.getScore() >= BORDER_LINE){
				passedStudents.add(student);
			}
		}
		
		/**
		 * テストの点の高い順に並べ替える。
		 */
		passedStudents.sort(new Comparator<Student>() {
			@Override
			public int compare(Student s1, Student s2) {
				return s2.getScore() - s1.getScore();
			}
		});
		
		/**
		 * クラスごとに生徒を分類する。
		 */
		Map<SchoolClass, List<String>> result = new TreeMap<>();
		for(SchoolClass c : SchoolClass.values()){
			result.put(c, new ArrayList<>());
		}
		for(Student passedStudent : passedStudents){
			SchoolClass c = passedStudent.getSchoolClass();
			List<String> names = result.get(c);
			names.add(passedStudent.getName());
			result.put(c, names);
		}
		
		System.out.println("Java8の機能無しで分類 ... " + result);
	}
	
	@Test
	public void Java8の機能有りで分類を行う(){
		Map<SchoolClass, List<String>> result = getSampleStudents().stream()
			.filter(student -> student.getScore() >= BORDER_LINE)
			/**
			 * 以下のフィルターは名前が4文字以上の生徒を抽出する。
			 */
			//.filter(student -> student.getName().length() >= 4)
			.sorted(Comparator.comparing(Student::getScore).reversed())
			.collect(groupingBy(Student::getSchoolClass, 
				TreeMap::new, 
				mapping(Student::getName, toList())));
		
		System.out.println("Java8の機能有りで分類 ... " + result);
	}
	
	@Test
	public void Java8の機能無しでクラスの平均点を求める(){
		List<Student> students = getSampleStudents();
		
		/**
		 * 生徒の得点をクラス毎に分類する。
		 */
		Map<SchoolClass, List<Integer>> scoreMap = new HashMap<>();
		for(SchoolClass c : SchoolClass.values()){
			scoreMap.put(c, new ArrayList<>());
		}
		for(Student student : students){
			SchoolClass c = student.getSchoolClass();
			List<Integer> scores = scoreMap.get(c);
			scores.add(student.getScore());
			scoreMap.put(c, scores);
		}
		
		/**
		 * 各クラスの平均点を求めてクラスごとに分類する。
		 */
		Map<SchoolClass, Double> result = new TreeMap<>();
		for(SchoolClass c : scoreMap.keySet()){
			List<Integer> scores = scoreMap.get(c);
			int sum = 0;
			for(int score : scores){
				sum += score;
			}
			double avg = sum / scores.size();
			result.put(c, avg);
		}
		
		System.out.println("Java8の機能無しでクラスの平均点で分類 ... " + result);
	}
	
	@Test
	public void Java8の機能有りでクラスの平均点を求める(){
//		Map<SchoolClass, Double> result = getSampleStudents().parallelStream()
//			.collect(groupingBy(Student::getSchoolClass, 
//				TreeMap::new,
//				averagingInt(Student::getScore)));
		
		List<Student> students = getSampleStudents();
		Map<SchoolClass, Double> result = 
			averagingClassify(students, Student::getSchoolClass, Student::getScore);
		
		/**
		 * クラス名の自然順で並べ替える。
		 */
		result = new TreeMap<>(result);
		
		System.out.println("Java8の機能有りでクラスの平均点で分類 ... " + result);
	}
	
	private <T, S, C extends Collection<S>> Map<T, Double> 
		averagingClassify(C source, Function<S, T> mapper, ToIntFunction<S> provider){
		
		Map<T, Double> result = source.parallelStream()
			.collect(groupingByConcurrent(mapper, 
				averagingInt(provider)));
		
		return result;
	}

	private static class Employee{
		private final String name;
		private final int numberOfYears;
		private final int earnings;

		public Employee(String name, int age, int earnings) {
			this.name = name;
			this.numberOfYears = age;
			this.earnings = earnings;
		}

		public int getNumberOfYears() {
			return numberOfYears;
		}
		
		public int getEarnings() {
			return earnings;
		}

		@Override
		public String toString() {
			return name + ":" + numberOfYears + ":" + earnings;
		}
	}
	
	private enum Generation {
		ROOKIE(Integer.MIN_VALUE, 3), 
		MIDDLE(4, 9), 
		VETERAN(10, Integer.MAX_VALUE);
		
		private final int lowerLimit;
		private final int upperLimit;

		private Generation(int lowerLimit, int upperLimit) {
			this.lowerLimit = lowerLimit;
			this.upperLimit = upperLimit;
		}
		
		private static Generation of(int numberOfYears){
			for(Generation g : values()){
				if(g.lowerLimit <= numberOfYears && numberOfYears <= g.upperLimit){
					return g;
				}
			}
			
			throw new IllegalArgumentException("Unknown Generation");
		}
	}
		
	@Test
	public void 収入の平均値を世代別に分類する(){
		List<Employee> employees = Arrays.asList(
			new Employee("foo", 1, 100),
			new Employee("bar", 2, 120),
			new Employee("baz", 2, 120),
			new Employee("hoge", 3, 120),
			new Employee("taro", 4, 160),
			new Employee("jiro", 5, 200),
			new Employee("saburo", 7, 350),
			new Employee("shiro", 15, 220),
			new Employee("goro", 8, 400),
			new Employee("pochi", 10, 350)
		);
		
		Map<Generation, Double> result = averagingClassify(employees, 
			(Employee employee) -> Generation.of(employee.getNumberOfYears()), 
			Employee::getEarnings);
		
		System.out.println("Java8の機能有りで収入の平均値を世代別に分類 ... " + result);
	}
		
}
