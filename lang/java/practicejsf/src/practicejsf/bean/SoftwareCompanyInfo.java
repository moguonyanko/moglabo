package practicejsf.bean;

import java.io.Serializable;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.faces.bean.ManagedBean;
import javax.faces.bean.SessionScoped;

import practicejsf.bean.service.ProgrammerService;

/**
 * @todo
 * フィールドも含めてシリアライズ可能にしているが，コンテキストリロード後の
 * dataTable表示結果は初期表示に戻ってしまう。コンストラクタでのcompanyNameの
 * 初期化の仕方がよくないのかもしれない。
 */
@ManagedBean(name = "companyInfo")
@SessionScoped
public class SoftwareCompanyInfo implements Serializable {

	private static final long serialVersionUID = 7651329421190L;

	/**
	 * デシリアライズされる際に引数無しコンストラクタが呼び出されて
	 * companiesは初期化される。しかしリロードされると正常に初期化されないため
	 * getter呼び出し時に例外が発生してしまう。
	 */
	private final List<SoftwareCompany> companies;

	/**
	 * companyNameさえセッションに保持できていれば同じセッション中に
	 * Faceletsページを再表示した時でも以前のcompanyNameを選択した状態を
	 * 再現できる。
	 */
	private String companyName;

	private final Map<String, SoftwareCompany> companyMap;

	public SoftwareCompanyInfo() {
		List<Programmer> programmers = ProgrammerService.getSampleProgrammers();
		int size = programmers.size();
		companies = Arrays.asList(
			new SoftwareCompany("Hoge.com", programmers.subList(0, 1)),
			new SoftwareCompany("Foo bank", programmers.subList(1, 3)),
			new SoftwareCompany("うさぎ商会", programmers.subList(3, size))
		);
		companyName = companies.get(0).getCompanyName();
		companyMap = companies.stream()
			.collect(Collectors.toMap(SoftwareCompany::getCompanyName, c -> c));
	}

	public String getCompanyName() {
		return companyName;
	}

	public void setCompanyName(String companyName) {
		this.companyName = companyName;
	}

	public List<String> getCompanyChoices() {
		return companies.stream()
			.map(SoftwareCompany::getCompanyName)
			.collect(Collectors.toList());
	}

	public SoftwareCompany getCompany() {
		return companyMap.get(companyName);
	}

}
