using SpaceY.Core.EquationTerms;
using Xunit;

namespace SpaceY.Tests
{
	/// <summary>
	/// Test cases for equations.
	/// </summary>
	public class EquationTest
	{
		[Fact]
		public void AdditionTest()
		{
			var oneTerm = new ConstantTerm(1);
			var additionTerm = new AdditionTerm(new [] {oneTerm, oneTerm});
			// 1+1 = 2
			Assert.Equal(2, additionTerm.Evaluate());
		}

		[Fact]
		public void AdditionSerialization()
		{
			var oneTerm = new ConstantTerm(1);
			var additionTerm = new AdditionTerm(new [] {oneTerm, oneTerm});
			Assert.Equal("(1 + 1)", additionTerm.Serialize());
		}
	}
}
