package practicejsf.bean;

import java.util.List;
import java.util.stream.Collectors;

import javax.faces.bean.ManagedBean;

import practicejsf.bean.service.ProgrammerService;

/**
 * 可変な状態を持たない限りリクエストスコープで良いはずだが，セッションスコープで
 * 保持されるクラスのフィールドになっているのでシリアライズ可能にしている。
 */
@ManagedBean(name = "company1")
public class SoftwareCompany extends Company {
	
	private static final long serialVersionUID = 7771239324L;

	private final List<Programmer> programmers;

	private static final String BUSINESS = "Software Developpment";

	public SoftwareCompany() {
		this("私の小さな会社", ProgrammerService.getSampleProgrammers());
	}

	public SoftwareCompany(String companyName, List<Programmer> programmers) {
		super(companyName, BUSINESS);
		this.programmers = programmers;
	}

	public List<Programmer> getProgrammers() {
		return programmers.stream().collect(Collectors.toList());
	}

}
