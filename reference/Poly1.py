# coding:Shift_JIS
"""
#******************************************************************************
#
#	機　　能：一変数多項式クラス
#	名　　称：Poly1.py
#	環　　境：Python2.3J
#	版　　数：0.04 (2005-11-08)
#	著 作 者：梅谷 武 (2005-09-21 ～ 2005-11-08)
#
#******************************************************************************
"""
from Rat import *

class Poly1:

    char = 'X'					# 不定元文字（クラス共通）

    # Class method
    def SetChar( self, chr ):
        """ 不定元文字を設定する。（クラスメソッド） """
        if isinstance( chr, str ):
            if len( chr ) != 1:
                raise TypeError, "Poly1.SetChar:type error %s" % chr
            self.char = chr
        else:
            raise TypeError, "Poly1.SetChar:type error %s" % chr
    SetChar = classmethod( SetChar )

    # initialize
    def __init__( self, val ):
        if isinstance( val, list ):
            self.__list = self.CutBack( val )
        else:
            raise TypeError, "Poly1:type error %s" % val

    # a + b
    def __add__( self, other ):
        return Poly1( self.add( self.__list, self.GetList( other ) ) )
    def __radd__( self, other ):
        return Poly1( self.add( self.GetList( other ), self.__list ) )

    # a - b
    def __sub__( self, other ):
        return Poly1( self.sub( self.__list, self.GetList( other ) ) )
    def __rsub__( self, other ):
        return Poly1( self.sub( self.GetList( other ), self.__list ) )

    # a * b
    def __mul__( self, other ):
        return Poly1( self.mul( self.__list, self.GetList( other ) ) )
    def __rmul__( self, other ):
        return Poly1( self.mul( self.GetList( other ), self.__list ) )

    # a / b
    def __div__( self, other ):
        return Poly1( self.div( self.__list, self.GetList( other ) ) )

    # a % b
    def __mod__( self, other ):
        return Poly1( self.mod( self.__list, self.GetList( other ) ) )

    # -a
    def __neg__( self ):
        return Poly1( self.mul_const( self.__list, -1 ) )

    # a ** n
    def __pow__( self, n ):
        return Poly1( self.pow( self.__list, n ) )

    # convert to string
    def __repr__( self ):
        return self.ListToStr( self.__list )

    def add( self, p1, p2 ):
        """ 加法の実装関数：p1 + p2 を返す。 """
        if len( p1 ) > len( p2 ):
            new = [i for i in p1]
            for i in range( len( p2 ) ): new[i] += p2[i]
        else:
            new = [i for i in p2]
            for i in range( len( p1 ) ): new[i] += p1[i]
        return new

    def sub( self, p1, p2 ):
        """ 減法の実装関数：p1 - p2 を返す。 """
        return self.add( p1, self.mul_const( p2, -1 ) )

    def mul( self, p1, p2 ):
        """ 乗法の実装関数：p1 * p2 を返す。 """
        if len( p1 ) > len( p2 ): s, l = p2, p1
        else: s, l = p1, p2
        new = []
        for i in range( len( s ) ):
            new = self.add( new, self.mul_term( l, s[i], i ) )
        return new

    def mul_term( self, p, coef, index ):
        """ 単項式を乗ずる：p * coef^index を返す。 """
        new = [0] * index
        for i in p: new.append( i * coef )
        return new

    def mul_const( self, p, const ):
        """ 係数を乗ずる：p * const を返す。 """
        return [ const * i for i in p ]

    def div( self, p1, p2 ):
        """ 除法の実装関数：p1 / p2 を返す。 """
        if len( p2 ) > len( p1 ):
            return [0]
        elif len( p1 ) == len( p2 ):
            q = Rat( p1[len( p1 ) - 1] , p2[len( p1 ) - 1] )
            return [q]
        else:
            m = len( p1 ) - 1; n = len( p2 ) - 1
            q = [0] * ( m - n + 1 )
            for k in range( m - n, -1, -1 ):
                q[k] = Rat( p1[n+k] , p2[n] )
                p1 = self.sub( p1, self.mul_term( p2, q[k], k ) )
            return q

    def mod( self, p1, p2 ):
        """ 剰余の実装関数：p1 % p2 を返す。 """
        if len( p2 ) > len( p1 ):
            return p1
        elif len( p1 ) == len( p2 ):
            q = Rat( p1[len( p1 ) - 1] , p2[len( p1 ) - 1] )
            return self.sub( p1, self.mul_const( p2, q ) )
        else:
            m = len( p1 ) - 1; n = len( p2 ) - 1
            q = [0] * ( m - n + 1 )
            for k in range( m - n, -1, -1 ):
                q[k] = Rat( p1[n+k] , p2[n] )
                p1 = self.sub( p1, self.mul_term( p2, q[k], k ) )
            return p1

    def pow( self, p, n ):
        """ 冪乗の実装関数：p ^ n を返す。（暫定版） """
        if isinstance( n, int ):
            new = [1]
            for i in range( n ): new = self.mul( new, p )
            return new
        else:
            raise TypeError, "Poly1.pow:type error %s" % n

    def CutBack( self, pList ):
        """ リストの後方から零を削除する。 """

        for i in range( len( pList ) - 1, -1, -1 ):
            if pList[i]: break
        return pList[:i+1]

    def ListToStr( self, pList ):
        """ リストを多項式文字列へ変換する。 """
        if pList == [ 0 ]:
            return '0'
        p = self.CutBack( pList )
        str = []
        for i in range( len( p ) - 1, -1, -1 ):
            if p[i]:
                if i < len( p ) - 1:
                    if p[i] >= 0: str.append( '+' )
                    else: str.append( '-' )
                    str.append( self.TermToStr( abs( p[i] ), i ) )
                else:
                    str.append( self.TermToStr( p[i], i ) )
        return ' '.join( str )

    def TermToStr( self, coef, index ):
        """ 係数と指数を単項式文字列へ変換する。 """
        if index == 1:
            if   coef ==  1: return "%s"  % self.char
            elif coef == -1: return "-%s" % self.char
            return "%s%s" % ( coef, self.char )
        elif index: 
            if   coef ==  1: return "%s^%d"  % ( self.char, index )
            elif coef == -1: return "-%s^%d" % ( self.char, index )
            return "%s%s^%d" % ( coef, self.char, index )
        else:
            return "%s" % coef

    def GetList( self, val ):
        """ 多項式クラスからリストを取得する。 """
        if isinstance( val, self.__class__ ):
            new = val.__list
            return new
        else:
            raise TypeError, "Poly1.GetList:type error %s" % val
            return None

    def Horner( self, const ):
        """ ホーナー法による代入計算 """
        a = 0
        n = len( self.__list )
        for i in range( n ):
            b = a * const + self.__list[n-i-1]
            a = b
        return b

    def diff1( self ):
        """ １階微分 """
        new = []
        n = len( self.__list )
        for i in range( 1, n, 1 ):
            new.append( i * self.__list[i] )
        return Poly1( new )

    def diff( self, order ):
        """ n 階微分 """
        if not isinstance( order, int ):
            raise TypeError, "Poly1.diff:type error %s" % order
        elif order < 0:
            raise TypeError, "Poly1.diff:parameter error %d" % order
        elif order == 0:
            return self
        elif order == 1:
            return self.diff1()
        else:
            n = len( self.__list )
            if order >= n:
                return Poly1( [ 0 ] )
            a = self
            for i in range( order ):
                a = a.diff1()
        return a

def test():
    print

if __name__ == '__main__': test()
