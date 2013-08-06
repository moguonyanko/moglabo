package exercise.localize;

import java.text.NumberFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.logging.Level;
import java.util.logging.Logger;

public class FormatPractice {

	/**
	 * @param args the command line arguments
	 */
	public static void main(String[] args) {
		
		Date today = new Date();
		SimpleDateFormat formatter = new SimpleDateFormat("y年M月d日 h時m分s秒");
		//SimpleDateFormat formatter = new SimpleDateFormat("y年M月d日");
		String fomattedToday = formatter.format(today);
		System.out.println(fomattedToday);
		
		try {
			Date parsedToday = formatter.parse(fomattedToday);
			System.out.println(today.equals(parsedToday));
			System.out.println(today.getTime());
			System.out.println(parsedToday.getTime());
		} catch (ParseException ex) {
			Logger.getLogger(FormatPractice.class.getName()).log(Level.SEVERE, null, ex);
		}
		
		SimpleDateFormat usFormatter = new SimpleDateFormat("MMM", Locale.US);
		System.out.println(usFormatter.format(today));
		SimpleDateFormat detailUsFormatter = new SimpleDateFormat("MMMM", Locale.US);
		System.out.println(detailUsFormatter.format(today));
		SimpleDateFormat timezoneFormatter = new SimpleDateFormat("zzz");
		System.out.println(timezoneFormatter.format(today));
		SimpleDateFormat detailTimezoneFormatter = new SimpleDateFormat("zzzz", Locale.US);
		System.out.println(detailTimezoneFormatter.format(today));
		
		double currencyValue = 567.123;
		NumberFormat currencyFormatter = NumberFormat.getCurrencyInstance();
		System.out.println(currencyFormatter.format(currencyValue));
		NumberFormat usCurrensyFormatter = NumberFormat.getCurrencyInstance(Locale.US);
		System.out.println(usCurrensyFormatter.format(currencyValue));
	}
}
