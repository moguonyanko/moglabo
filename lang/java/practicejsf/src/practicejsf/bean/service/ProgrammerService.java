package practicejsf.bean.service;

import java.util.Arrays;
import java.util.List;

import practicejsf.model.Programmer;

public class ProgrammerService {

	public static List<Programmer> getSampleProgrammers() {
		List<Programmer> programmers = Arrays.asList(
			new Programmer("Mog", "Mogeo", Programmer.Level.JUNIOR, 34762.52,
				Arrays.asList("SQL", "Prolog", "OCL", "Datalog")),
			new Programmer("Usao", "Hapoo", Programmer.Level.JUNIOR, 43941.86,
				Arrays.asList("Java", "C++", "Python", "Go")),
			new Programmer("Foo", "Barbaz", Programmer.Level.INTERMEDIATE, 83678.29,
				Arrays.asList("Visual Basic", "VB.NET", "C#", "Visual C++", "Assembler")),
			new Programmer("Meco", "Meky", Programmer.Level.INTERMEDIATE, 96550.03,
				Arrays.asList("REXX", "CLIST", "Java", "PL/I", "COBOL")),
			new Programmer("あいう", "えおたろう", Programmer.Level.INTERMEDIATE, 103488.80,
				Arrays.asList("Objective-C", "AppleScript", "Java", "Perl", "Tcl"))
		);

		return programmers;
	}

}
