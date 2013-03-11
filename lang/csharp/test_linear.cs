using System;
using NUnit.Framework;
using Linear;

namespace TestLinear
{
	[TestFixture]
	public class TestVector
	{
		[Test]
		public void TestNormarize()
		{
			Vector vector = new Vector(12, -5, 0);
			vector.Normalize();
			// Vector answer = new Vector(0.923, -0.385, 0);
			// Assert.AreEqual(answer, vector);
			Assert.AreEqual(0.923, Math.Round(vector.x, 3));
			Assert.AreEqual(-0.385, Math.Round(vector.y, 3));
			Assert.AreEqual(0, vector.z);
		}
		
		[Test]
		public void TestOperatorPlus()
		{
			Vector v1 = new Vector(1, 2, 3);
			Vector v2 = new Vector(3, 2, 1);
			Vector result = v1 + v2;
			Vector expect = new Vector(4, 4, 4);
			Assert.AreEqual(expect, result);
		}
	}
}
