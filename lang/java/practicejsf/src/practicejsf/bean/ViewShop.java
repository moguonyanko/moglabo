package practicejsf.bean;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.faces.view.ViewScoped;
import javax.inject.Named;

@Named
@ViewScoped
public class ViewShop implements Serializable {

	private static final long serialVersionUID = 438269223L;

	public static class Item {

		private int id;
		private String name;

		public Item(int itemno, String itemName) {
			this.id = itemno;
			this.name = itemName;
		}

		public Item(Item item) {
			id = item.id;
			name = item.name;
		}

		public int getId() {
			return id;
		}

		public void setId(int id) {
			this.id = id;
		}

		public String getName() {
			return name;
		}

		public void setName(String name) {
			this.name = name;
		}
	}

	private List<Item> list = new ArrayList<>();
	private Item nowItem;
	private boolean editable;

	/**
	 * 使っているViewScopedがjavax.faces.viewではなくjavax.faces.bean以下の
	 * アノテーションだとPostConstructを指定してもメソッドが呼び出されない。
	 * それどころか自分で定義したコンストラクタによる初期化も行われない。
	 */
	@PostConstruct
	public void initialize(){
		list.addAll(Arrays.asList(
			new Item(1, "鉛筆"),
			new Item(2, "定規"),
			new Item(3, "消しゴム")
		));
		resetItem();
	}

	private void resetItem(){
		nowItem = new Item(-1, "");
	} 
	
	public void add() {
		int newId = list.isEmpty() ? 1 : list.get(list.size() - 1).getId() + 1;
		nowItem.setId(newId);
		list.add(nowItem);
		resetItem();
	}
	
	public void edit(Item item){
		nowItem = item;
		editable = true;
	}

	public void save() {
		resetItem();
		editable = false;
	}
	
	public void delete(Item item){
		list.remove(item);
	}

	public List<Item> getList() {
		return new ArrayList<>(list);
	}

	public Item getItem() {
		return nowItem;
	}
	
	public boolean isEditable(){
		return editable;
	}
	
}
