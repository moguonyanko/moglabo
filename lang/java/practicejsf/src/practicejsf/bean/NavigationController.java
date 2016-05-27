package practicejsf.bean;

import javax.faces.bean.ManagedBean;
import javax.faces.bean.ManagedProperty;
import javax.faces.bean.RequestScoped;

@ManagedBean(name = "navigationController", eager = true)
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

}
