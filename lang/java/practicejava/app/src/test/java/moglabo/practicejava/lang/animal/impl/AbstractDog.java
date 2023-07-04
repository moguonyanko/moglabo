package moglabo.practicejava.lang.animal.impl;

import moglabo.practicejava.lang.animal.base.AbstractAnimal;

/**
 * AbstractAnimalクラスのcryメソッドがデフォルトスコープだとこのクラスからは
 * 参照できないので実装できないのだがコンパイルエラーにならない。その場合このクラスの
 * cryメソッドは継承されたメソッドではない通常のメソッド扱いになるからである。
 * これをエラーとして検出するには@Overrideを指定する。
 */
public abstract class AbstractDog extends AbstractAnimal {
    @Override
    protected String cry() {
        return "...";
    }
}
