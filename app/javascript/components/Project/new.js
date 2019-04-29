/*
 *  new.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 04/26/19
 *  Copyright 2018 WessCope
 */

import React            from 'react';
import { Section }      from 'bloomer/lib/layout/Section';
import { Columns }      from 'bloomer/lib/grid/Columns';
import { Column }       from 'bloomer/lib/grid/Column';
import { Box }          from 'bloomer/lib/elements/Box';
import { Label }        from 'bloomer/lib/elements/Form/Label';
import { Control }      from 'bloomer/lib/elements/Form/Control';
import { Input }        from 'bloomer/lib/elements/Form/Input';
import { Field }        from 'bloomer/lib/elements/Form/Field/Field';
import { TextArea }     from 'bloomer/lib/elements/Form/TextArea';
import { Button }       from 'bloomer/lib/elements/Button';
import { UploadField }  from '@navjobs/upload';

export class ProjectNew extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmit.bind(this);
  }

  handleSubmit() {

  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <Section>
            <br/>

            <Columns isCentered>
              <Column isSize={9}>
                <Box>
                  
                    <h1 className="title">Create New Project.</h1>
                    <hr />

                    <Field>
                      <Label>Name</Label>
                      <Control>
                        <Input type="text" placeholder="Project name"/>
                      </Control>
                    </Field>

                    <Field>
                      <Label>Description</Label>
                      <Control>
                        <TextArea />
                      </Control>
                    </Field>

                    <Field isGrouped>
                      <Control>
                        <Button type="submit">Save</Button>
                      </Control>
                    </Field>
                </Box>
              </Column>
            </Columns>
          </Section>

          <Section>
            <Columns isCentered>
              <Column isSize={9}>
                <Box>
                  <UploadField>
                    <div>Click here to upload</div>
                  </UploadField>
                </Box>
              </Column>
            </Columns>
          </Section>
        </form>
      </div>
    )
  }
}
