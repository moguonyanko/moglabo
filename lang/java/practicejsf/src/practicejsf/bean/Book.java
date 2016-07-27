package practicejsf.bean;

import java.util.Date;

import javax.faces.bean.ManagedBean;
import javax.faces.bean.RequestScoped;

@ManagedBean(name = "book", eager = true)
@RequestScoped
public class Book {

	private int price;
	
	private Date publication = new Date();

	/**
	 * ManagedPropertyが指定されていなくてもbook.priceのように
	 * JSFを利用するページからアクセスすることはできる。ManagedPropertyは
	 * ELを使ってフィールドの初期化を行いたい時に使うものなのかもしれない。
	 */
	private String title;
	
	public int getPrice() {
		return price;
	}

	public void setPrice(int price) {
		this.price = price;
	}

	public Date getPublication() {
		return publication;
	}

	public void setPublication(Date publication) {
		this.publication = publication;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

}
