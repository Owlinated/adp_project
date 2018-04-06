using System.Collections.Generic;

namespace SpaceY.Coffee.MathExpression
{
	public interface IEquationTerm
	{
		float Evaluate();

		string Serialize();
	}
}
