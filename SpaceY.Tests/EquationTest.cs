using SpaceY.Coffee.MathExpression;
using Xunit;

namespace SpaceY.Tests
{
	public class EquationTest
	{
		[Fact]
		public void AdditionTest()
		{
			var oneTerm = new ConstantEquationTerm(1);
			var additionTerm = new AddEquationTerm(new [] {oneTerm, oneTerm});
			Assert.Equal(2, additionTerm.Evaluate());
		}

		[Fact]
		public void AdditionSerialization()
		{
			var oneTerm = new ConstantEquationTerm(1);
			var additionTerm = new AddEquationTerm(new [] {oneTerm, oneTerm});
			Assert.Equal("(1 + 1)", additionTerm.Serialize());
		}
	}
}
