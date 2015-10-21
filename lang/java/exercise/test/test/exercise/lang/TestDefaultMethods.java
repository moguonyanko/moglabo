package test.exercise.lang;

import java.time.LocalDateTime;
import java.time.Month;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

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
	public void デフォルトの税金計算が出来る(){
		Tax tax = new Excise();
		
		Taxable item = new ShopItem("Apple", 100);
		
		int actual = tax.on(item);
		int expected = 108;
		
		assertThat(actual, is(expected));
	}
	
	@Test
	public void 優遇される金額が得られる(){
		Favorable f = new ShopItem("Apple", 100); 
		
		int actual = f.getValue();
		int expected = 0;
		
		assertThat(actual, is(expected));
	}
	
	@Test
	public void デフォルトメソッドで時刻を変更し取得する(){
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
	public void デフォルトメソッドで並べ替える(){
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
	
}
