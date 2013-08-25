package exercise.lang;


/**
 * Reference: 
 * JAVA PUZZLERS No.44 CuttingClass
 */
public class NoClassDefErrorPractice{

	public static void main(String[] args){
		Strange1.main(args);
		Strange2.main(args);
	}
}

/**
 * Java7_25ではStrange1とStrange2で動作に違いが無いようである。
 */
class Strange1{

	public static void main(String[] args){

		try{

			Missing missing = new Missing();

		}catch(NoClassDefFoundError error){

			System.out.println("No class definition.");

		}

	}
}

class Strange2{

	public static void main(String[] args){
		
		Missing missing;
		
		try{

			missing = new Missing();

		}catch(NoClassDefFoundError error){

			System.out.println("No class definition.");

		}

	}
}

class Missing{

	public Missing(){
	}
}
