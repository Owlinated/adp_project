using System.Collections.Generic;

namespace SpaceY.Interface
{
    /// <summary>
    /// Equation representation that is shared between client and server.
    /// </summary>
    public class RestEquation
    {
        /// <summary>
        /// Gets or sets identifier of equation.
        /// </summary>
        public int? Id { get; set; }

        /// <summary>
        /// Gets or sets description of equation.
        /// </summary>
        public string Description { get; set; }


        /// <summary>
        /// Gets or sets the serialized equation.
        /// </summary>
        public string Equation { get; set; }

        /// <summary>
        /// Gets or sets the equation's parameters.
        /// </summary>
        public IList<RestEquationParam> Parameters { get; set; }
    }
}
