# coding:Shift_JIS
"""
#******************************************************************************
#
#	機　　能：多変数多項式クラス
#	名　　称：PolyM.py
#	環　　境：Python2.3J
#	版　　数：0.04 (2005-11-08)
#	著 作 者：梅谷 武 (2005-09-29 ～ 2005-11-08)
#
#******************************************************************************
"""

class PolyM:

    chars = 'XYZSTUVW'				# 不定元文字（クラス共通）
    length = len( chars )			# 変数長    （クラス共通）

    # Class method
    def SetChars( self, chrs ):
        """ 不定元文字を設定する。（クラスメソッド） """
        if isinstance( chrs, str ):
            self.chars  = chrs
            self.length = len( chrs )
        else:
            raise TypeError, "Poly1.SetChars:type error %s" % chrs
    SetChars = classmethod( SetChars )

    # initialize
    def __init__( self, val ):
        if isinstance( val, dict ):		# 辞書か？
            for k in val.iterkeys():
                if isinstance( k, tuple ):	# キーがタプルか？
                    if len( k ) > self.length:	# タプルの長さがlength以下か？
                        raise TypeError, "PolyM:type error %s" % k
                else:
                    raise TypeError, "PolyM:type error %s" % k
            self.__dict = self.CutBack( val )
        else:
            raise TypeError, "PolyM:type error %s" % val

    # a + b
    def __add__( self, other ):
        return PolyM( self.add( self.__dict, self.GetList( other ) ) )
    def __radd__( self, other ):
        return PolyM( self.add( self.GetList( other ), self.__dict ) )

    # a - b
    def __sub__( self, other ):
        return PolyM( self.sub( self.__dict, self.GetList( other ) ) )
    def __rsub__( self, other ):
        return PolyM( self.sub( self.GetList( other ), self.__dict ) )

    # a * b
    def __mul__( self, other ):
        return PolyM( self.mul( self.__dict, self.GetList( other ) ) )
    def __rmul__( self, other ):
        return PolyM( self.mul( self.GetList( other ), self.__dict ) )

    # a / b

    # a % b

    # -a
    def __neg__( self ):
        return PolyM( self.mul_const( self.__dict, -1 ) )

    # a ** n
    def __pow__( self, n ):
        return PolyM( self.pow( self.__dict, n ) )

    # convert to string
    def __repr__( self ):
        return self.DictToStr( self.__dict )

    def add( self, p1, p2 ):
        """ 加法の実装関数：p1 + p2 を返す。 """
        new = {}
        keylist1 = p1.keys()
        keylist2 = p2.keys()
        for i in keylist1:
            if i not in keylist2:
                new[i] = p1[i]
            else:
                new[i] = p1[i] + p2[i]
        for i in keylist2:
            if i not in keylist1:
                new[i] = p2[i]
        return new

    def sub( self, p1, p2 ):
        """ 減法の実装関数：p1 - p2 を返す。 """
        new = {}
        keylist1 = p1.keys()
        keylist2 = p2.keys()
        for i in keylist1:
            if i not in keylist2:
                new[i] = p1[i]
            else:
                new[i] = p1[i] - p2[i]
        for i in keylist2:
            if i not in keylist1:
                new[i] = -p2[i]
        return new

    def mul( self, p1, p2 ):
        """ 乗法の実装関数：p1 * p2 を返す。 """
        new = {}
        keylist2 = p2.keys()
        for i in keylist2:
            new = self.add( new, self.mul_term( p1, i, p2[i] ) )
        return new

    def mul_term( self, p, kterm, coef ):
        """ 単項式を乗ずる：p * ( kterm, coef ) を返す。 """
        pDict = {}
        lterm = list( kterm )
        for k, v in p.iteritems():
            l = list( k )
            if len( l ) > len( lterm ):
                new = [i for i in l]
                for i in range( len( lterm ) ): new[i] += lterm[i]
            else:
                new = [i for i in lterm]
                for i in range( len( l ) ): new[i] += l[i]
            pDict[tuple( new )] = v * coef
        return pDict

    def mul_const( self, p, const ):
        """ 係数を乗ずる：p * const を返す。 """
        new = {}
        for k, v in p.iteritems():
            new[k] = v * const
        return new

    def pow( self, p, n ):
        """ 冪乗の実装関数：p ^ n を返す。（暫定版） """
        if isinstance( n, int ):
            new = { ():1 }
            for i in range( n ): new = self.mul( new, p )
            return new
        else:
            raise TypeError, "PolyM.pow:type error %s" % n

    def CutBack( self, pDict ):
        """ 辞書から値が0の項目を削除し、キーのタプルの後方から零を削除する。 """
        new = {}
        for k, v in pDict.iteritems():
            if v != 0:
                l = len( k )
                for i in range( len( k ) - 1, 0, -1 ):
                    if k[i] == 0:
                        l -= 1
                    else:
                        break
                new[k[:l]] = v
        return new

    def DictToStr( self, pDict ):
        """ 辞書を多項式文字列へ変換する。 """
        p = self.CutBack( pDict )
        str = []
        keylist = p.keys()
        keylist.sort()
        keylist.reverse()
        top = 1
        for i in keylist:
            if top != 1:
                if p[i] > 0:
                    str.append( '+' )
                else:
                    str.append( '-' )
            else:
                top = 0
                if p[i] < 0:
                    str.append( '-' )
            str.append( self.TermToStr( i, p[i] ) )
        return ' '.join( str )

    def TermToStr( self, k, coef ):
        """ 係数と指数を単項式文字列へ変換する。 """
        if len( k ) == 0:
            str = "%s" % abs( coef )
            return str
        if abs( coef ) == 1:
            str = ""
        else:
            str = "%s" % abs( coef )
        for i in range( 0, len( k ), 1 ):
            chr = self.chars[i]
            if k[i] == 1:
                str += chr
            elif ( 1 < k[i] ) and ( k[i] < 10 ):
                str += chr + "^%d" % k[i]
            elif ( k[i] >= 10 ):
                str += chr + "^(%d)" % k[i]
        return str

    def GetList( self, val ):
        """ 多項式クラスから辞書を取得する。 """
        if isinstance( val, self.__class__ ):
            new = val.__dict
            return new
        else:
            raise TypeError, "PolyM.GetList:type error %s" % val
            return None

def test():
    print

if __name__ == '__main__': test()
