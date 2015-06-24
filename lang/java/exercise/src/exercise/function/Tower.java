package exercise.function;

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
import java.util.List;
import java.util.Objects;

public class Tower {
	
	private final int index;
	private final Deque<Integer> disks = new ArrayDeque<>();

	public Tower(int index) {
		this.index = index;
	}
	
	public void add(int d){
		if(disks.isEmpty() || disks.peek().intValue() <= d){
			disks.push(d);
		}else{
			throw new IllegalArgumentException("Error placing disk " + d);
		}
	}
	
	public void moveToTop(Tower t){
		int topDiskIndex = disks.pop();
		t.add(topDiskIndex);
		
		//debug print
		//System.out.println("Move disk " + topDiskIndex + " from " + index + " to " + t.index);
	}
	
	public void moveDisks(int n, Tower dest, Tower buff){
		if(n > 0){
			moveDisks(n - 1, buff, dest);
			moveToTop(dest);
			buff.moveDisks(n - 1, dest, this);
		}
	}

	public final int getIndex() {
		return index;
	}

	@Override
	public String toString() {
		return disks.toString();
	}
	
	@Override
	public boolean equals(Object obj) {
		if(obj instanceof Tower){
			Tower other = (Tower)obj;
			
			if(index != other.index){
				return false;
			}
			
			/**
			 * DequeはequalsとhashCodeをオーバーライドしていないので
			 * そのまま比較するとObjectクラスのメソッドで比較が行われ
			 * 意図した比較結果が得られない可能性が生じる。
			 * これを回避するためにDequeをListに変換してから比較する。
			 * ArrayDequeではなくLinkedListを使用することでも回避できそうだが
			 * LinkedListほどの複雑さを持つデータ構造を必要としていない。
			 */
			List<Integer> selfTower = new ArrayList<>(disks);
			List<Integer> otherTower = new ArrayList<>(disks);
			
			return selfTower.equals(otherTower);
		}else{
			return false;
		}
	}

	@Override
	public int hashCode() {
		return Objects.hash(index, disks);
	}
	
}
