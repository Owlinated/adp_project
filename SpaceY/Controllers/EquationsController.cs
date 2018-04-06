using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using SpaceY.DataAccess;

namespace SpaceY.Controllers
{
	/// <inheritdoc />
	/// <summary>
	/// Controller for making equations accessible by clients.
	/// </summary>
	[Route("api/[controller]")]
	public class EquationsController : Controller
	{
		private EquationStore EquationStore { get; } = new EquationStore();

		/// <summary>
		/// Get list of all equations.
		/// </summary>
		[HttpGet]
		public IEnumerable<RestEquation> List()
		{
			return EquationStore.Equations
				.Select(equation => new RestEquation { Id = equation.Id, Equation = equation.Serialize() });
		}

		/// <summary>
		/// Get equation with <paramref name="id"/>.
		/// </summary>
		[HttpGet("{id}")]
		public RestEquation Get(int id)
		{
			return EquationStore.Equations
					.Select(equation => new RestEquation { Id = equation.Id, Equation = equation.Serialize() })
					.FirstOrDefault(equation => equation.Id == id)
				?? throw new ArgumentException(nameof(id));
		}

		/// <summary>
		/// Get the value of location with <paramref name="id"/>.
		/// </summary>
		[HttpGet("{id}/[action]")]
		public float Evaluate(int id)
		{
			return EquationStore.Equations.FirstOrDefault(equation => equation.Id == id)?.Evaluate()
				?? throw new ArgumentException(nameof(id));
		}

		/// <summary>
		/// Equation representation that is shared between client and server
		/// </summary>
		public class RestEquation
		{
			public int Id { get; set; }
			public string Equation { get; set; }
		}
	}
}