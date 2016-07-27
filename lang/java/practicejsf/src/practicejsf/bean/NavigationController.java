package practicejsf.bean;

import java.util.Random;

import javax.faces.bean.ManagedBean;
import javax.faces.bean.ManagedProperty;
import javax.faces.bean.RequestScoped;

import practicejsf.util.Faces;

@ManagedBean(eager = true)
@RequestScoped
public class NavigationController {

	private enum Page {
		NAVIGATION("0"), PAGE1("1"), PAGE2("2");

		private final String pageId;

		private Page(String pageId) {
			this.pageId = pageId;
		}

		private static Page parse(String pageId) {
			if (pageId != null) {
				for (Page page : values()) {
					if (page.pageId.equalsIgnoreCase(pageId)) {
						return page;
					}
				}
			}

			return NAVIGATION;
		}
		
		private String getPageName() {
			return name().toLowerCase();
		}
	}

	@ManagedProperty(value = "#{param.pageId}")
	private String pageId;
	
	private static final String PAGE_OUTCOME = "page";
	
	@ManagedProperty(value = "#{param.toHome}")
	private boolean toHome;

	private String language;
	
	public String moveToPage1() {
		return "page1";
	}

	public String showPage() {
		return Page.parse(pageId).getPageName();
	}

	public String processPage1() {
		return PAGE_OUTCOME;
	}
	
	public String processPage2() {
		return PAGE_OUTCOME;
	}
	
	public String getPageId() {
		return pageId;
	}

	public void setPageId(String pageId) {
		this.pageId = pageId;
	}

	public String goHome() {
		return PAGE_OUTCOME;
	}
	
	public boolean isToHome() {
		return toHome;
	}
	
	public void setToHome(boolean toHome) {
		this.toHome = toHome;
	}
	
	public String choosePage(){
		int pageNum = new Random().nextInt(Page.values().length);
		Page page = Page.parse(String.valueOf(pageNum));
		
		return page.getPageName();
	}

	public String getLanguage() {
		return language;
	}

	public void setLanguage(String language) {
		if(language == null){
			language = "";
		}
		this.language = language.trim();
	}
	
	public String showChoice(){
		if(Faces.isNullOrEmpty(language)){
			return Page.NAVIGATION.getPageName();
		} else if(language.equalsIgnoreCase("java")) {
			return Page.PAGE1.getPageName();
		} else {
			return Page.PAGE2.getPageName();
		}
	}

}
