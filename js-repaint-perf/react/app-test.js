/** @jsx React.DOM */

function DBMon(props) {
    return (
      <div id="container">
        <table class="table table-striped latest-data">
          <tbody>
            {
              props.databases.map(function(database) {
                return (
                  <tr>
                    <td class="dbname">
                      {database.dbname}
                    </td>
                    <td class="query-count">
                      <span class={database.lastSample.countClassName}>
                        {database.lastSample.queries.length}
                      </span>
                    </td>
                      {
                        database.lastSample.topFiveQueries.map(function(query, index) {
                          return (
                            <td class={ "Query " + query.elapsedClassName}>
                              {query.formatElapsed}
                              <div class="popover left">
                                <div class="popover-content">{query.query}</div>
                                <div class="arrow"/>
                              </div>
                            </td>
                          );
                        })
                      }
                  </tr>
                );
              })
            }
          </tbody>
        </table>
      </div>
    );
}

var renderDBMon = function() {
  React.render(<DBMon databases={ENV.generateData().toArray()} />, document.getElementById('dbmon'));
  Monitoring.renderRate.ping();
  setTimeout(renderDBMon, ENV.timeout);
}
console.time('mount')
renderDBMon()
console.timeEnd('mount')









