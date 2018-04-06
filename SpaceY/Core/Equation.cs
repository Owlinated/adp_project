using SpaceY.Coffee.MathExpression;

namespace SpaceY.Coffee
{
	public class Equation
	{
		public int Id { get; }

		private IEquationTerm Term;

		public Equation(int id, string serialized)
		{
			Id = id;
			var oneTerm = new ConstantEquationTerm(1);
			Term = new AddEquationTerm(new [] {oneTerm, oneTerm});
			var result = Term.Evaluate();
		}

		public float Evaluate()
		{
			return Term.Evaluate();
		}

		public string Serialize()
		{
			return "f() = " + Term.Serialize();
		}
	}
}
