import { useMutation, useQuery } from '@apollo/client'
import BaseComponent from 'components/base-component/BaseComponent'
import { FieldArray, Form, Formik } from 'formik'
import * as Yup from 'yup'
import { makeSelectOptions, throwErrorMsg } from 'global-utils'
import { permitAdmin } from 'permission-utils'
import { GET_GATHERINGSERVICES } from 'queries/ListQueries'
import React, { useContext, useState } from 'react'
import { ChurchContext } from 'contexts/ChurchContext'
import FormikControl from 'components/formik-components/FormikControl'
import PlusSign from 'components/buttons/PlusMinusSign/PlusSign'
import MinusSign from 'components/buttons/PlusMinusSign/MinusSign'
import { MAKE_STREAM_INACTIVE } from 'pages/directory/update/CloseChurchMutations'
import { useNavigate } from 'react-router'
import Popup from 'components/Popup/Popup'
import RoleView from 'auth/RoleView'
import { Button, Container, Row, Col } from 'react-bootstrap'
import { MemberContext } from 'contexts/MemberContext'
import { HeadingPrimary } from 'components/HeadingPrimary/HeadingPrimary'
import HeadingSecondary from 'components/HeadingSecondary'
import SubmitButton from 'components/formik-components/SubmitButton'
import usePopup from 'hooks/usePopup'

const StreamForm = ({ initialValues, onSubmit, title, newStream }) => {
  const { clickCard, streamId } = useContext(ChurchContext)
  const { theme } = useContext(MemberContext)
  const { togglePopup, isOpen } = usePopup()
  const navigate = useNavigate()
  const { data, loading, error } = useQuery(GET_GATHERINGSERVICES)
  const [buttonLoading, setButtonLoading] = useState(false)
  const [CloseDownStream] = useMutation(MAKE_STREAM_INACTIVE)

  const gatheringServiceOptions = makeSelectOptions(data?.gatheringServices)

  const validationSchema = Yup.object({
    name: Yup.string().required(`Stream Name is a required field`),
    leaderId: Yup.string().required(
      'Please choose a leader from the drop down'
    ),
    councils: newStream
      ? null
      : Yup.array().of(
          Yup.object().required('Please pick a council from the dropdown')
        ),
  })

  return (
    <BaseComponent loading={loading} error={error} data={data && initialValues}>
      <Container>
        <HeadingPrimary>{title}</HeadingPrimary>
        <HeadingSecondary>{initialValues.name + ' Stream'}</HeadingSecondary>
      </Container>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        validateOnMount
      >
        {(formik) => (
          <Container className="py-4">
            <Form>
              <div className="form-group">
                <Row className="row-cols-1 row-cols-md-2">
                  {/* <!-- Basic Info Div --> */}
                  <Col className="mb-2">
                    <RoleView roles={permitAdmin('GatheringService')}>
                      <Row className="form-row">
                        <Col>
                          <FormikControl
                            control="select"
                            name="gatheringService"
                            label="Select a Gathering Service"
                            options={gatheringServiceOptions}
                            defaultOption="Select a Gathering Service"
                          />
                        </Col>
                      </Row>
                    </RoleView>

                    <FormikControl
                      control="input"
                      name="name"
                      label={`Name of Stream`}
                      placeholder={`Name of Stream`}
                    />

                    <Row className="d-flex align-items-center mb-3">
                      <RoleView roles={permitAdmin('GatheringService')}>
                        <Col>
                          <FormikControl
                            control="memberSearch"
                            name="leaderId"
                            label="Choose a Leader"
                            placeholder="Start typing..."
                            initialValue={initialValues?.leaderName}
                            setFieldValue={formik.setFieldValue}
                            aria-describedby="Member Search Box"
                            error={formik.errors.leaderId}
                          />
                        </Col>
                      </RoleView>
                    </Row>
                    {!newStream && (
                      <>
                        <small className="pt-2">
                          {`Select any councils that are being moved to this Stream`}
                        </small>
                        <FieldArray name="councils">
                          {(fieldArrayProps) => {
                            const { push, remove, form } = fieldArrayProps
                            const { values } = form
                            const { councils } = values

                            return (
                              <>
                                {councils.map((council, index) => (
                                  <Row key={index} className="form-row">
                                    <Col>
                                      <FormikControl
                                        control="councilSearch"
                                        name={`councils[${index}]`}
                                        placeholder="Council Name"
                                        initialValue={council?.name}
                                        setFieldValue={formik.setFieldValue}
                                        aria-describedby="Constituency Name"
                                        error={
                                          formik.errors.councils &&
                                          formik.errors.councils[index]
                                        }
                                      />
                                    </Col>
                                    <Col className="col-auto d-flex">
                                      <PlusSign onClick={() => push()} />
                                      {(index > 0 ||
                                        councils?.length !== 1) && (
                                        <MinusSign
                                          onClick={() => remove(index)}
                                        />
                                      )}
                                    </Col>
                                  </Row>
                                ))}
                              </>
                            )
                          }}
                        </FieldArray>
                      </>
                    )}
                  </Col>
                </Row>
              </div>

              <SubmitButton formik={formik} />
            </Form>

            {isOpen && (
              <Popup handleClose={togglePopup}>
                Are you sure you want to close down this fellowship?
                <Button
                  variant="primary"
                  type="submit"
                  className={`btn-main ${theme}`}
                  onClick={() => {
                    setButtonLoading(false)
                    CloseDownStream({
                      variables: {
                        id: streamId,
                        leaderId: initialValues.leaderId,
                      },
                    })
                      .then((res) => {
                        setButtonLoading(false)
                        clickCard(res.data.CloseDownStream)
                        togglePopup()
                        navigate(`/stream/displayall`)
                      })
                      .catch((error) => {
                        throwErrorMsg(
                          `There was an error closing down this stream`,
                          error
                        )
                      })
                  }}
                >
                  {buttonLoading ? `Submitting...` : `Yes, I'm sure`}
                </Button>
                <Button
                  variant="primary"
                  className={`btn-secondary mt-2 ${theme}`}
                  onClick={togglePopup}
                >
                  No, take me back
                </Button>
              </Popup>
            )}

            {!newStream && (
              <Button
                variant="primary"
                size="lg"
                disabled={formik.isSubmitting}
                className={`btn-secondary ${theme} mt-3`}
                onClick={togglePopup}
              >
                {`Close Down Stream`}
              </Button>
            )}
          </Container>
        )}
      </Formik>
    </BaseComponent>
  )
}

export default StreamForm
